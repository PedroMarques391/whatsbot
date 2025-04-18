import { Message } from "whatsapp-web.js";
import { extractTextFromBody } from "../../utils/helpers";
import { geminiResponse } from "./index"

export async function response(message: Message, temperature: number, maxOutputTokens: number) {
    if (message.fromMe) return
    try {
        const question = extractTextFromBody(message.body);

        const text = await geminiResponse(`responda: ${question}`, temperature, maxOutputTokens);

        await message.react('✅');

        await message.reply(text);
    } catch (error) {
        await message.reply('Desculpe, não sei como responder isso. 😫😫');
    }
}