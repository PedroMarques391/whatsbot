import { extractTextFromBody } from '@/utils';
import { Message } from 'whatsapp-web.js';
import { openRouterResponse } from './openRouterService';

export async function response(message: Message, temperature: number, maxOutputTokens: number) {
    if (message.fromMe) return;
    try {
        const question = extractTextFromBody(message.body);

        const text = await openRouterResponse(`responda: ${question}`, temperature, maxOutputTokens);

        await message.react('✅');

        await message.reply(text);
    } catch (error) {
        console.error('An error occurred while processing the response:', error);
        await message.reply('Desculpe, não sei como responder isso. 😫😫');
    }
}