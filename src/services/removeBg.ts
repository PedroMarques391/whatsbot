import { Chat, Client, Message, MessageMedia } from 'whatsapp-web.js';
import path from 'path';
import fs from 'fs';
import removeBackground from '@imgly/background-removal-node';
import { delay } from '@/utils';

export async function removeBg(message: Message, chat: Chat, client: Client) {
    const quotedMessage = await message.getQuotedMessage();
    const msg = message.hasQuotedMsg ? quotedMessage : message;
    await msg.react('⏳');



    if (msg.type !== 'image') {
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

    removeBackground(imagePath)
        .then(async (blob: Blob) => {
            const arrayBuffer = await blob.arrayBuffer();

            fs.writeFileSync(imageOutput, Buffer.from(arrayBuffer));

            const media = MessageMedia.fromFilePath(imageOutput);

            await client.sendMessage(chat.id._serialized, media, {
                sendMediaAsDocument: true,
                caption: 'Aqui está sua imagem com o fundo removido! '
            }).then(async (message) => await message.react('❤️'));
            await msg.react('⌛');
            await delay(1000);

            fs.unlinkSync(imagePath);
            await delay(2000);

            fs.unlinkSync(imageOutput);
        })
        .catch(async (error) => {
            console.error('Erro ao remover o fundo da imagem:', error);
            await msg.reply('Desculpe, ocorreu um erro ao tentar remover o fundo da imagem. Por favor, tente novamente mais tarde. 😔')
                .then(async (message) => await message.react('😥'));
            await msg.react('😥');
        })
        .finally(async () => {
            await msg.react('✅');
        });
}