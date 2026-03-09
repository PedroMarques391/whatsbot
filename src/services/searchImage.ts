import { extractTextFromBody } from '@/utils';
import { Chat, Client, Message, MessageMedia } from 'whatsapp-web.js';
import { GOOGLE_SEARCH_API_CTX_IMAGES, GOOGLE_SEARCH_API_KEY } from '../config/env';

export async function imageSearch(message: Message, chat: Chat, client: Client) {
    const word = extractTextFromBody(message.body);
    await message.react('❤');
    console.log('chamou', word);

    const APIKEY = GOOGLE_SEARCH_API_KEY;
    const cx = GOOGLE_SEARCH_API_CTX_IMAGES;

    const URL = await fetch(`https://www.googleapis.com/customsearch/v1?key=${APIKEY}&cx=${cx}&q=${word}&searchType=image`);
    const data: any = await URL.json();

        await client.sendMessage(chat.id._serialized, 'Infelizmente essa busca não retornou nenhum resultado satisfatório. Quer tentar com outras palavras? ✨');
    await message.reply('Selecionei algumas imagens interessantes para você. ☕');
    await client.sendMessage(chat.id._serialized, 'Só um momento enquanto eu as envio...').then((message) => message.react('⏳'));
    console.log(data.items);
    for (let i = 0; i < 5; i++) {
        const item = data.items[i];

        try {
            const media = await MessageMedia.fromUrl(item.link, { filename: 'ImagesByAdaBot' });
            await client.sendMessage(chat.id._serialized, media);
            await new Promise((resolve) => { setTimeout(resolve, 1000); });
        } catch (error) {
            console.error('Erro ao enviar imagem', error);
            continue;
        }
    }
    await client.sendMessage(chat.id._serialized, 'Aqui estão. Espero que seja útil. ✨');
}