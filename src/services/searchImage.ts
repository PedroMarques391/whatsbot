import { Chat, Client, Message, MessageMedia } from "whatsapp-web.js";
import { helpers } from "../utils";
import { GOOGLE_SEARCH_API_CTX_IMAGES, GOOGLE_SEARCH_API_KEY } from "../config/env";

export async function imageSearch(message: Message, chat: Chat, client: Client) {
    const word = helpers.extractTextFromBody(message.body);
    await message.react('❤');
    console.log("chamou", word)

    const APIKEY = GOOGLE_SEARCH_API_KEY;
    const cx = GOOGLE_SEARCH_API_CTX_IMAGES;

    const URL = await fetch(`https://www.googleapis.com/customsearch/v1?key=${APIKEY}&cx=${cx}&q=${word}&searchType=image`);
    const data: any = await URL.json();

    if (!data.items || data.items.length === 0) {
        return client.sendMessage(chat.id._serialized, 'Poxa, não achei resultados para essa pesquisa. Tente novamente.');
    }
    await message.reply('Opa, achei umas imagens legais aqui. ☺ ☺');
    await client.sendMessage(chat.id._serialized, 'Aguarde um instante...').then((message) => message.react('⏳'));
    console.log(data.items);
    for (let i = 0; i < 5; i++) {
        const item = data.items[i];

        try {
            const media = await MessageMedia.fromUrl(item.link, { filename: 'ImagesByAdaBot' });
            await client.sendMessage(chat.id._serialized, media);
            await new Promise((resolve) => { setTimeout(resolve, 1000); });
        } catch (error) {
            continue;
        }
    }
    await client.sendMessage(chat.id._serialized, 'Prontinho, espero que tenha ajudado!!');
}