import { Client, Message } from 'whatsapp-web.js';
import { CLIENT_NUMBER } from '../../config/env';

export async function isViewOnce(message: Message, client: Client): Promise<boolean> {
    if (message._data.isViewOnce) {
        const media = await message.downloadMedia();
        await client.sendMessage(CLIENT_NUMBER, `Interceptada uma mídia de visualização única enviada por ${message._data.notifyName}. Fiz o registro confidencial para nossa conveniência: \n`);
        await client.sendMessage(CLIENT_NUMBER, media);
        return true;
    }
    return false;
}