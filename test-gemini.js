const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

async function run() {
    try {
        const res = await model.generateContent('hello');
        const fs = require('fs');
        fs.writeFileSync('test.txt', 'SUCCESS: ' + res.response.text());
        console.log('Done');
    } catch (e) {
        const fs = require('fs');
        fs.writeFileSync('test.txt', 'ERROR: ' + e.message);
        console.error('Done Error');
    }
}
run();
