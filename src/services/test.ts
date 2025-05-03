import { Chat, Client, Message, MessageMedia } from 'whatsapp-web.js';
import { removeBackground, } from '@imgly/background-removal-node';
import path from 'path';
import fs from 'fs';

export async function testFunction(message: Message, chat: Chat, client: Client) {
    // await message.reply("epaa, não estou com nenhuma função teste ativa. 😑")
    //     .then(async (message) => await message.react("🌸"))
    // await message.react("✅")

    if (message.type !== 'image') {
        await message.reply('Oops! I can only process images right now. Please send me an image. 😊');
        return;
    }

    const media = await message.downloadMedia();

    const outputDir: string = path.resolve(process.cwd(), 'src/assets/images/imageWithoutBg');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagePath = path.join(outputDir, 'image.jpg');
    const imageOutput = path.join(outputDir, 'image.png');

    fs.writeFileSync(imagePath, Buffer.from(media.data, 'base64'));

    removeBackground(imagePath).then(async (blob: Blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        fs.writeFileSync(imageOutput, Buffer.from(arrayBuffer));

        const media = MessageMedia.fromFilePath(imageOutput);

        await client.sendMessage(chat.id._serialized, media, { sendMediaAsDocument: true });

        fs.unlinkSync(imagePath);
        fs.unlinkSync(imageOutput);
    });

}