const express = require('express');
const router = express.Router();
const axios = require('axios');
const aiService = require('../services/aiService');
const sheetService = require('../services/sheetService');
const { applyFilter } = require('../services/filterService');

// WhatsApp webhook verification
router.get('/webhook', (req, res) => {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === verifyToken) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
});

// WhatsApp incoming messages
router.post('/webhook', async (req, res) => {
    // Basic boilerplate for receiving WhatsApp messages
    try {
        const body = req.body;
        if (body.object) {
            // ALWAYS acknowledge receipt immediately with a 200 OK to prevent Meta from retrying
            res.sendStatus(200);

            if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
                const message = body.entry[0].changes[0].value.messages[0];

                // Only process text messages to avoid triggering on images/audio/etc
                if (message.type !== 'text') {
                    return;
                }

                const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
                const from = message.from; // extract the phone number from the webhook payload
                const msg_body = message.text.body; // extract the message text from the webhook payload

                // Run the heavy lifting asynchronously after a short delay
                // This forces the Node server to instantly flush the 200 OK back to Meta, 
                // preventing proxy buffering issues that cause Meta to retry the webhook 5 times.
                setTimeout(async () => {
                    try {

                        // 1. Send question to Gemini to analyze intent/extract params
                        const aiIntent = await aiService.analyzeIntent(msg_body);

                        // 2. Fetch data from Google Sheet
                        const sheetData = await sheetService.fetchData();

                        // 3. Filter data
                        const filteredData = applyFilter(sheetData, aiIntent);

                        // 4. Format and reply (using RAG)
                        const replyText = await aiService.generateResponse(msg_body, filteredData);

                        // 5. Send message back via WhatsApp Cloud API
                        const token = process.env.WHATSAPP_TOKEN;

                        if (!token || token === 'your_whatsapp_token_here') {
                            console.warn("⚠️ WHATSAPP_TOKEN is not configured in .env. Skipping reply.");
                        } else {
                            try {
                                await axios({
                                    method: 'POST',
                                    url: `https://graph.facebook.com/v17.0/${phone_number_id}/messages`,
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    },
                                    data: {
                                        messaging_product: 'whatsapp',
                                        to: from,
                                        type: 'text',
                                        text: { body: replyText }
                                    }
                                });
                                console.log(`✅ Reply sent to ${from}`);
                            } catch (err) {
                                console.error("❌ Failed to send WhatsApp message:", err.response ? err.response.data : err.message);
                            }
                        }
                    } catch (asyncErr) {
                        console.error("❌ Background processing error:", asyncErr);
                    }
                }, 100);
            }
            // `res.sendStatus(200)` was moved to the top of this block to prevent retries
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.sendStatus(500);
        }
    }
});

module.exports = router;
