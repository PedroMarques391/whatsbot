require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const instructions = process.env.BOT_INSTRUCTION.split('|');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.8,
        topP: 0.9,
        topK: 40,
        presencePenalty: 0.4,
        frequencyPenalty: 0.4,
    },
    systemInstruction: {
        role: 'system',
        parts: [
            { text: instructions[0] },
            { text: instructions[1] },
            { text: instructions[2] },
            { text: instructions[3] },
            { text: instructions[4] },
        ],

    },
});

module.exports = {
    model,
};
