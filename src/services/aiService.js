const { GoogleGenerativeAI } = require('@google/generative-ai');

class AiService {
    constructor() {
        // We'll initialize the client when it's first needed to ensure env vars are loaded
        this.genAI = null;
        this.model = null;
    }

    init() {
        if (!this.genAI) {
            const apiKey = process.env.GEMINI_API_KEY;
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
        }
    }

    async analyzeIntent(userMessage) {
        this.init();
        console.log(`Analyzing message with Gemini: "${userMessage}"`);

        const prompt = `
You are an AI assistant parsing user requests for a database search.
A user will ask a question about data in a Google Sheet.
Extract the key filtering criteria from the user's message and return them as a clean JSON object.
Use lowercase keys that represent the likely column headers (e.g., "status", "priority", "assignee", "category", "project", etc.).
For example, if the user asks "Show me all high priority tasks assigned to John", return:
{"priority": "high", "assignee": "john"}

If the user asks a general question, try your best to extract the core search terms.
If there are no clear search terms, return an empty object: {}

User Message: "${userMessage}"

Return ONLY valid JSON. Do not include markdown formatting or backticks.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;

            // Clean up the response to ensure it's valid JSON
            let responseText = response.text();

            // Remove markdown code blocks if the model included them despite instructions
            responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

            return JSON.parse(responseText);
        } catch (error) {
            console.error("❌ Error analyzing intent with Gemini:", error.message);
            // Default to empty filter if AI fails
            return {};
        }
    }

    async generateResponse(userMessage, retrievedData) {
        this.init();
        console.log(`Generating RAG response with Gemini for: "${userMessage}"`);

        const prompt = `
You are a helpful and professional WhatsApp task-tracking assistant.
A user has asked a question: "${userMessage}"

Here is the data retrieved from the database based on their request:
${JSON.stringify(retrievedData, null, 2)}

Provide a friendly, natural, and concise answer to their question using ONLY the provided data.
If the retrieved data is empty ([]), politely inform them that you couldn't find any tasks matching their request.
Do not use markdown formatting like **bold** or *italics* excessively as it's for WhatsApp, but you can use basic formatting if helpful.
Keep it brief and conversational. Do not include markdown code block syntax.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;

            return response.text().trim();
        } catch (error) {
            console.error("❌ Error generating RAG response with Gemini:", error.message);
            return "I'm sorry, I'm having trouble processing that right now.";
        }
    }
}

module.exports = new AiService();
