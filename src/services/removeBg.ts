import { staticSticker } from '@/helpers';
import { delay, sendStickerErrors } from '@/utils';
import removeBackground from '@imgly/background-removal-node';
import fs from 'fs';
import path from 'path';
import { Chat, Client, Message, MessageMedia } from 'whatsapp-web.js';

export async function removeBg(message: Message, chat: Chat, client: Client) {
    const quotedMessage = await message.getQuotedMessage();
    const msg = message.hasQuotedMsg ? quotedMessage : message;
    await msg.react('⏳');
    const errorMessage = sendStickerErrors[Math.floor(Math.random() * sendStickerErrors.length)];



    if (msg.type !== 'image' && msg.type !== 'sticker') {
        await msg.reply(
            '😑 Sério mesmo? Esse comando é só pra imagens. Não tá claro? 🙃'
        )
            .then(async (message) => await message.react('🙄'));
        await msg.react('❌');
        return;
    }

    const media = await msg.downloadMedia();

    const outputDir: string = path.resolve(process.cwd(), 'src/assets/images/imageWithoutBg');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagePath = path.join(outputDir, 'image.jpg');
    const imageOutput = path.join(outputDir, `${message._data.notifyName.split(' ')[0]}.png`);

    fs.writeFileSync(imagePath, Buffer.from(media.data, 'base64'));

    await removeBackground(imagePath)
        .then(async (blob: Blob) => {
            const arrayBuffer = await blob.arrayBuffer();

            fs.writeFileSync(imageOutput, Buffer.from(arrayBuffer));

            const media = MessageMedia.fromFilePath(imageOutput);

            if (msg.type === 'image') {
                await client.sendMessage(chat.id._serialized, media, {
                    sendMediaAsDocument: true,
                    caption: 'Aqui está sua imagem com o fundo removido! '
                }).then(async (message) => await message.react('❤️'));
                await msg.react('⌛');
                return;
            }


            if (msg.type === 'sticker') {
                await staticSticker(message, media, chat, client, message._data.notifyName, outputDir, errorMessage);
                return;
            }


        })
        .catch(async (error) => {
            console.error('Erro ao remover o fundo:', error);
            await msg.reply('Tivemos um problema processando o arquivo. Tente novamente em alguns instantes, por favor. ☕')
                .then(async (message) => await message.react('😥'));
            await msg.react('😥');
        })
        .finally(async () => {
            await msg.react('✅');
            fs.unlinkSync(imagePath);
            await delay(2000);
            fs.unlinkSync(imageOutput);
        });
}