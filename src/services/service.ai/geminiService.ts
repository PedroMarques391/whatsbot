import { GoogleGenAI } from '@google/genai';
import { getSystemInstructions } from './instructions';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export async function geminiResponse(
    userMessage: string,
    temperature: number,
    maxOutputTokens: number
): Promise<string> {
    const res = await genAI.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: {
            role: 'user',
            parts: [{ text: userMessage }],
        },
        config: {
            systemInstruction: {
                role: 'system',
                parts: getSystemInstructions(),
            },
            maxOutputTokens,
            temperature,
            topK: 2,
        },
    });

    if (!res.text) return 'Algo deu errado.';

    return res.text;
}

export async function geminiChat(
    userMessage: string,
    botResponse: string
): Promise<string> {
    const chat = genAI.chats.create({
        model: 'gemini-2.0-flash',
        history: [
            {
                role: 'user',
                parts: [{ text: 'O usuário vai responder uma mensagem user' }],
            },
            {
                role: 'model',
                parts: [{ text: botResponse }],
            },
        ],
        config: {
            systemInstruction: {
                role: 'system',
                parts: getSystemInstructions(),
            },
            maxOutputTokens: 300,
            temperature: 1.0,
            topK: 2,
        },
    });

    const response = await chat.sendMessage({ message: userMessage });
    if (!response.text) return 'Algo deu errado.';
    return response.text;
}
