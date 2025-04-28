import WAWebJS, { Client, Message } from "whatsapp-web.js";
import path from 'path';
import fs from "fs"
import { texts, helpers } from "../utils";

export async function makeSticker(message: Message, client: Client) {
    const quotedMessage = await message.getQuotedMessage()
    const msg = message.hasQuotedMsg ? quotedMessage : message

    const chat = await msg.getChat();
    const media = await msg.downloadMedia();

    const authorName = message._data.notifyName || 'Ada Ada';
    const errorMessage: string = texts.sendStickerErrors[Math.floor(Math.random() * texts.sendStickerErrors.length)];
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
        await helpers.dynamicSticker(msg, media, chat, client, authorName, outputDir, errorMessage)
        return;
    }
    if (msg.type === 'image') {
        await helpers.staticSticker(msg, media, chat, client, authorName, outputDir, errorMessage)
        return
    }
}