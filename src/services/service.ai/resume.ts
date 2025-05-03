import { Message, Client } from 'whatsapp-web.js';
import { geminiResponse } from './geminiService';
import { resumeErrorMessages, resumePrompt } from '@/utils';

export async function resumeMessages(client: Client, msg: Message) {
    const chat = await msg.getChat();

    await client.sendMessage(chat.id._serialized, 'Entendido! Vou analisar as últimas mensagens e gerar um resumo.')
        .then(async (message) => message.react('⏳'));

    const getMessages = await chat.fetchMessages({ limit: 500 });
    const textMessages = getMessages
        .filter((textMessage) =>
            !textMessage.hasMedia &&
            !textMessage.fromMe &&
            !textMessage.body.startsWith('/')
        )
        .map((textMessage) => textMessage.body);

    if (textMessages.length < 20) {
        await msg.react('✅');

        const randomMessage = resumeErrorMessages[
            Math.floor(Math.random() * resumeErrorMessages.length)
        ];

        await client.sendMessage(chat.id._serialized, randomMessage)
            .then(async (message) => await message.react('😥'));
        await msg.react('😥');
        return;
    }

    await msg.react('⌛');

    const prompt = resumePrompt(textMessages);

    try {
        const summary = await geminiResponse(prompt, 0.5, 500);

        await msg.react('✅');
        await client.sendMessage(chat.id._serialized, summary);
    } catch (error) {
        console.error('Error while generating summary:', error);
        await msg.react('❌');
        await client.sendMessage(chat.id._serialized, 'Desculpe, não consegui processar o resumo no momento. 😢');
    }
}
