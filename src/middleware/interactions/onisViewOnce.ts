import { Client, Message } from 'whatsapp-web.js';
import { CLIENT_NUMBER } from '../../config/env';

export async function isViewOnce(message: Message, client: Client): Promise<boolean> {
    if (message._data.isViewOnce) {
        console.log('passou aqui');
        const media = await message.downloadMedia();
        await client.sendMessage(CLIENT_NUMBER, `Eii, você recebeu uma mensagem de visualização única de ${message._data.notifyName}. Vou deixar guardado aqui: \n`);
        await client.sendMessage(CLIENT_NUMBER, media);
        return true;
    }
    return false;
}