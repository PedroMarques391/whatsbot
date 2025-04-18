import { Message, Client } from "whatsapp-web.js";
import { geminiResponse } from "./index"
import { texts } from "../../utils";

export async function resumeMessages(client: Client, msg: Message) {
    const chat = await msg.getChat();

    await client.sendMessage(chat.id._serialized, 'Entendido! Vou analisar as últimas mensagens e gerar um resumo.')
        .then(async (message) => {
            await message.react('⏳');

            const getMessages = await chat.fetchMessages({ limit: 500 });
            const textMessages = getMessages
                .filter((textMessage) => !textMessage.hasMedia && !textMessage.fromMe && !textMessage.body.startsWith('/'))
                .map((textMessage) => textMessage.body);

            if (textMessages.length < 20) {
                await message.react('✅');
                const randomMessages = texts.resumeErrorMessages[
                    Math.floor(Math.random() * texts.resumeErrorMessages.length)];
                await client.sendMessage(chat.id._serialized, randomMessages)
                    .then((msgToReact) => msgToReact.react('😥'))
                    .finally(async () => {
                        await message.react('😥');
                    });
                return;
            }
            await message.react('⌛');

            const prompt = texts.resumePrompt(textMessages);

            try {
                const text = await geminiResponse(prompt, 0.5, 500);

                await message.react('✅');

                await client.sendMessage(chat.id._serialized, text);
            } catch (error) {
                await message.react('❌');
                await client.sendMessage(chat.id._serialized, 'Desculpe, não consegui processar o resumo no momento. 😢');
            }
        });
}