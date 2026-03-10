import { delay, extractTextFromBody } from '@/utils';
import { Client, Message, MessageMedia } from 'whatsapp-web.js';

export async function downloadTikTok(message: Message, client: Client) {
    const quotedMessage = await message.getQuotedMessage();
    const url = message.hasQuotedMsg ? quotedMessage.body : extractTextFromBody(message.body);
    const apiUrl = 'https://www.tikwm.com/api/';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    if (!url) {
        await client.sendMessage(message.from, 'Parece que faltou o link do vídeo. Coloque o link junto ao comando para eu conseguir baixar. ✨');
        return;
    }

    //TODO
    //Transformar 'isValidTikTokUrl' em um validator para ser reaproveitado posteriomente.
    const isValidTikTokUrl = /^https?:\/\/(vm\.)?tiktok\.com\/.+$/.test(url);

    if (!isValidTikTokUrl && message.body.includes('baixar')) return;

    if (!isValidTikTokUrl) {
        await client.sendMessage(message.from, 'O link fornecido não parece ser do TikTok. Podemos tentar novamente com a URL correta? ☕')
            .then(async (message) => await message.react('❌'));
        return;
    }
    await message.react('⏳');
    await delay(2000);
    await message.react('⌛');
    await client.sendMessage(message.from, 'Iniciando o download do vídeo. Isso levará apenas um momento...').then(async (message) => await message.react('☕'));

    try {
        const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}&count=1&version=1`, {
            signal: controller.signal,
        });
        clearTimeout(timeout);

        const data: any = await response.json();

        if (!data || !data.data || !data.data.play) {
            await client.sendMessage(message.from, 'Ocorreu uma falha ao acessar esse vídeo. Tem certeza de que ele está disponível? ✨');
            return;
        }

        const videoUrl: string = data.data.play;

        const media = await MessageMedia.fromUrl(videoUrl, { unsafeMime: true });

        await delay(1000);

        await client.sendMessage(message.from, media, {
            caption: 'Aqui está seu vídeo. ✨',
            sendMediaAsDocument: false,
        }).then(async (message) => await message.react('✅'));

        await message.react('✅');



    } catch (error) {
        console.error('[AdaBot] Erro ao baixar ou enviar o vídeo:', error);
        await client.sendMessage(message.from, 'Tive um contratempo interno ao processar e enviar esse arquivo. Tente novamente mais tarde. ☕')
            .then(async (message) => await message.react('❌'));
        await message.react('');
    }
}
