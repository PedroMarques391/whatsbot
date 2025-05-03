import { Chat, Client, Message } from 'whatsapp-web.js';
import path from 'path';
import fs from 'fs';
import { extractTextFromBody, sendStickerErrors } from '@/utils';
import { dynamicSticker, staticSticker } from '@/helpers';

export async function makeSticker(message: Message, client: Client) {
    const quotedMessage = await message.getQuotedMessage();
    const msg = message.hasQuotedMsg ? quotedMessage : message;

    const chat = await msg.getChat();
    const media = await msg.downloadMedia();

    const authorName = message._data.notifyName || 'Ada Ada';
    const errorMessage: string = sendStickerErrors[Math.floor(Math.random() * sendStickerErrors.length)];
    if (!media || !media.data) {
        await msg.reply('UwU~ Não consigo fazer mágica! ✨ Por favor, envie uma imagem ou vídeo para criar o sticker! 💖').then((message: Message) => {
            message.react('🌸');
        });
        return;
    }

    const outputDir: string = path.resolve(process.cwd(), 'src/assets/stickers');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    if (msg.type === 'video') {
        await dynamicSticker(msg, media, chat, client, authorName, outputDir, errorMessage);
        return;
    }
    if (msg.type === 'image') {
        await staticSticker(msg, media, chat, client, authorName, outputDir, errorMessage);
        return;
    }
}

export async function renameSticker(message: Message, chat: Chat, client: Client) {
    const name = extractTextFromBody(message.body);
    const quotedMessage = await message.getQuotedMessage();

    await message.react('⏳');

    if (!message.hasQuotedMsg || quotedMessage.type !== 'sticker') {
        await message.reply('Eii, preciso de uma figurinha para ser renomeada! 🌸✨')
            .then(async (message) => await message.react('🌸'));
        await message.react('❌');

        return;
    }
    if (name.length > 20 || name.length === 0) {
        const reply = name.length > 10
            ? 'Não acha esse nome muito grande? aprende a ser gente.'
            : 'Que criativo, um nome vazio. Não vou fazer isso.';
        await message.reply(reply)
            .then(async (message) => await message.react('🙄'));
        await message.react('❌');
        return;
    }

    const media = await quotedMessage.downloadMedia();

    await client.sendMessage(chat.id._serialized, media,
        {
            sendMediaAsSticker: true,
            stickerName: name,
            stickerAuthor: 'AdaBot',
            stickerCategories: ['figs']
        })
        .then(async (message) => await message.react('❤️'));
    await message.react('✅');

}