import { delay, extractTextFromBody } from '@/utils';
import { Client, Message, MessageMedia } from 'whatsapp-web.js';

export async function downloadTikTok(message: Message, client: Client) {
    const quotedMessage = await message.getQuotedMessage();
    const url = message.hasQuotedMsg ? quotedMessage.body : extractTextFromBody(message.body);
    const apiUrl = 'https://www.tikwm.com/api/';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    if (!url) {
        await client.sendMessage(message.from, '❌ Opa! Você esqueceu de colocar o link do vídeo. Tenta de novo aí!');
        return;
    }

    //TODO
    //Transformar 'isValidTikTokUrl' em um validator para ser reaproveitado posteriomente.
    const isValidTikTokUrl = /^https?:\/\/(vm\.)?tiktok\.com\/.+$/.test(url);

    if (!isValidTikTokUrl && message.body.includes('baixar')) return;

    if (!isValidTikTokUrl) {
        await client.sendMessage(message.from, 'Esse link não parece ser do TikTok. Manda um link válido, por favor!')
            .then(async (message) => await message.react('❌'));
        return;
    }
    await message.react('⏳');
    await delay(2000);
    await message.react('⌛');
    await client.sendMessage(message.from, 'Baixando o vídeo pra você...').then(async (message) => await message.react('🫶🏻'));

    try {
        const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}&count=1&version=1`, {
            signal: controller.signal,
        });
        clearTimeout(timeout);

        const data: any = await response.json();

        if (!data || !data.data || !data.data.play) {
            await client.sendMessage(message.from, '😢 Não consegui baixar o vídeo... Será que você consegue tentar com outro link?');
            return;
        }

        const videoUrl: string = data.data.play;

        const media = await MessageMedia.fromUrl(videoUrl, { unsafeMime: true });

        await delay(1000);

        await client.sendMessage(message.from, media, {
            caption: ' Prontinho! Nem demorou, viu?',
            sendMediaAsDocument: false,
        }).then(async (message) => await message.react('✅'));

        await message.react('✅');



    } catch (error) {
        console.error('[AdaBot] Erro ao baixar ou enviar o vídeo:', error);
        await client.sendMessage(message.from, 'Tive um problema ao tentar baixar ou enviar o vídeo. Me perdoa 😥')
            .then(async (message) => await message.react('❌'));
        await message.react('');
    }
}
