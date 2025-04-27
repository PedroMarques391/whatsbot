import { Chat, Client, GroupChat, Message, MessageMedia } from 'whatsapp-web.js';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';

/**
 * @description Separa o texto do comando (remove o primeiro argumento).
 */
function extractTextFromBody(body: string): string {
    const words = body.split(' ');
    words.shift();
    return words.join(' ').trim();
}

/**
 * @description Pausa a execução por um período de tempo especificado.
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @description Envia uma figurinha estática a partir de uma mídia.
 */
async function staticSticker(
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

    fs.writeFileSync(inputPath, Buffer.from(media.data, "base64"))

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

/**
 * @description Envia uma figurinha animada a partir de uma mídia.
 */
async function dynamicSticker(
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

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .setStartTime(0)
            .setDuration(6)
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
                console.error(err)
                await client.sendMessage(chat.id._serialized, 'Erro na conversão.');
                reject();
            })
            .run();
    });
}

function formatDate(unixTimeStamp: number): string {
    const date = new Date(unixTimeStamp * 1000);

    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    const seconds = (`0${date.getSeconds()}`).slice(-2);

    const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
}

/**
 * @description Retorna todos os participantes do grupo.
 */
function groupParticipants(chat: GroupChat): string[] {
    const participants = [];
    for (const participant of chat.participants) {
        participants.push(`${participant.id.user}@c.us`);
    }
    return participants;
}

async function isNotAValidNumber(message: Message, command: string): Promise<boolean> {
    if (extractTextFromBody(message.body) === '' || extractTextFromBody(message.body).match(/[+\-()]/)) {
        await message.reply(`Por favor, adicione um número após '${command}' sem caracteres especiais. \nPor exemplo, use '${command} 551188889999'.`);
        return true;
    }
    return false;
}

function isAuthorOrBot(message: Message): boolean {
    return `${extractTextFromBody(message.body)}@c.us` === message.author || `${extractTextFromBody(message.body)}@c.us` === message.to;
}

export {
    extractTextFromBody,
    delay,
    staticSticker,
    dynamicSticker,
    formatDate,
    groupParticipants,
    isNotAValidNumber,
    isAuthorOrBot
};
