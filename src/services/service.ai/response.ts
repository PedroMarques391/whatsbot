import { Message } from 'whatsapp-web.js';
import { geminiResponse } from './geminiService';
import { extractTextFromBody } from '@/utils';

export async function response(message: Message, temperature: number, maxOutputTokens: number) {
    if (message.fromMe) return;
    try {
        const question = extractTextFromBody(message.body);

        const text = await geminiResponse(`responda: ${question}`, temperature, maxOutputTokens);

        await message.react('✅');

        await message.reply(text);
    } catch (error) {
        console.error('An error occurred while processing the response:', error);
        await message.reply('Desculpe, não sei como responder isso. 😫😫');
    }
}