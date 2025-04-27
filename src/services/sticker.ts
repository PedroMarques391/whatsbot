import WAWebJS, { Client, Message } from "whatsapp-web.js";
import path from 'path';
import fs from "fs"
import { texts, helpers } from "../utils";

export async function makeSticker(message: Message, client: Client) {
    const chat = await message.getChat();
    const media = await message.downloadMedia();
    const authorName = message._data.notifyName || 'Ada Ada';
    const errorMessage: string = texts.sendStickerErrors[Math.floor(Math.random() * texts.sendStickerErrors.length)];
    if (!media || !media.data) {
        await message.reply('UwU~ Não consigo fazer mágica! ✨ Por favor, envie uma imagem ou vídeo para criar o sticker! 💖').then((message: Message) => {
            message.react('🌸');
        });
        return;
    }

    const outputDir: string = path.resolve(process.cwd(), 'src/assets/stickers');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    if (message.type === 'video') {
        await helpers.dynamicSticker(message, media, chat, client, authorName, outputDir, errorMessage)
        return;
    }
    if (message.type === 'image') {
        await helpers.staticSticker(message, media, chat, client, authorName, outputDir, errorMessage)
        return
    }
}