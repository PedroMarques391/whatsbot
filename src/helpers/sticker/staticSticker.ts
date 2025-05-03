import path from 'path';
import fs from 'fs';
import { Chat, Client, Message, MessageMedia } from 'whatsapp-web.js';
import sharp from 'sharp';

export async function staticSticker(
    message: Message,
    media: MessageMedia,
    chat: Chat,
    client: Client,
    authorName: string,
    outputDir: string,
    errorMessage: string
): Promise<void> {
    await message.react('⏳');
    const inputPath = path.join(outputDir, 'image.jpg');
    const outputPath = path.join(outputDir, 'image.webp');

    fs.writeFileSync(inputPath, Buffer.from(media.data, 'base64'));

    sharp(inputPath)
        .resize(512, 512)
        .toFile(outputPath)
        .then(async () => {
            const stats = fs.statSync(outputPath);
            if (stats.size >= 1000000) {
                const error = await client.sendMessage(chat.id._serialized, errorMessage);
                await error.react('😢');
                return;
            }
            const stickerMedia = MessageMedia.fromFilePath(outputPath);

            const sent = await client.sendMessage(chat.id._serialized, stickerMedia, {
                sendMediaAsSticker: true,
                stickerName: `Created by ${authorName}`,
                stickerAuthor: 'AdaBot',
            });
            await sent.react('❤');
            await message.react('✅');
        })
        .catch(async (error) => {
            console.error(error);
            await client.sendMessage(chat.id._serialized, 'Erro na conversão.');
        });

}
