import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { Chat, Client, Message, MessageMedia } from 'whatsapp-web.js';

export async function dynamicSticker(
    message: Message,
    media: MessageMedia,
    chat: Chat,
    client: Client,
    authorName: string,
    outputDir: string,
    errorMessage: string
): Promise<void> {
    const inputPath = path.join(outputDir, 'video.mp4');
    const outputPath = path.join(outputDir, 'video.webp');

    fs.writeFileSync(inputPath, Buffer.from(media.data, 'base64'));

    return new Promise((resolve) => {
        ffmpeg(inputPath)
            .setStartTime(0)
            .setDuration(10)
            .output(outputPath)
            .outputFormat('webp')
            .videoCodec('libwebp')
            .outputOption('-vf scale=512:512:force_original_aspect_ratio=increase,crop=512:512')
            .fps(12)
            .noAudio()
            .on('start', async () => {
                await message.react('⏳');
            })
            .on('progress', async () => {
                await message.react('⌛');
            })
            .on('end', async () => {
                const stats = fs.statSync(outputPath);
                if (stats.size >= 1000000) {
                    const error = await client.sendMessage(chat.id._serialized, errorMessage);
                    await error.react('😢');
                    resolve();
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
                resolve();
            })
            .on('error', async (err) => {
                console.error(err);
                const error = await client.sendMessage(
                    chat.id._serialized,
                    'Tivemos um contratempo técnico ao processar esse vídeo. Que tal tentarmos com outro arquivo mais tarde? ✨'
                );
                await error.react('🥺');
            })
            .run();
    });
}