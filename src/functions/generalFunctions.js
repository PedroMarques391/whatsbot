require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');

/**
 * @description Transforma uma imagem em figurinha.
 * @param {WAWebJS.Message} msg Chat do grupo em questão.
 * @param {Client} client Chat do grupo em questão.
 */

async function makeSticker(msg, client) {
  const chat = await msg.getChat();
  const media = await msg.downloadMedia();
  const authorName = msg._data.notifyName || 'Bot';
  if (!media || !media.data) {
    await msg.reply('Uai, você acha que eu faço milagre? 😆 Envie um vídeo ou imagem para criar o sticker!').then((message) => {
      message.react('❌');
    });
    return;
  }

  const outputDir = path.resolve(__dirname, '../videos/gift');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (msg.type === 'video') {
    const inputPath = path.join(outputDir, 'video.mp4');
    const outputPath = path.join(outputDir, 'sticker.webp');

    fs.writeFileSync(inputPath, Buffer.from(media.data, 'base64'));
    ffmpeg(inputPath)
      .setStartTime(0)
      .setDuration(6)
      .output(outputPath)
      .outputFormat('webp')
      .videoCodec('libwebp')
      .size('512x512')
      .fps(10)
      .noAudio()
      .on('start', async () => {
        await msg.react('⏳');
      })
      .on('progress', async () => {
        await msg.react('⌛');
      })
      .on('end', async () => {
        const stickerMedia = MessageMedia.fromFilePath(outputPath);
        await client.sendMessage(
          chat.id._serialized,
          stickerMedia,
          {
            sendMediaAsSticker: true,
            stickerName: `💀Created by ${authorName}`,
            stickerAuthor: 'HasturBot💀',
          },
        );
        await msg.react('✅');
      })
      .on('error', async () => {
        await client.sendMessage(chat.id._serialized, 'Erro na conversão.');
      })
      .run();
  } else {
    await msg.react('⏳');

    const stickerMedia = new MessageMedia(media.mimetype, media.data);
    await client.sendMessage(
      chat.id._serialized,
      stickerMedia,
      {
        sendMediaAsSticker: true,
        stickerName: `💀Created by ${authorName}`,
        stickerAuthor: 'HasturBot💀',
      },
    );
    await msg.react('✅');
  }
}
/**
 * @description Envia uma lista de audios.
 * @param {WAWebJS.Message} msg Mensagem recebida no chat.
 * @param {Client} client Instância do cliente do WhatsApp Web.
 */
async function sendAudios(msg, client) {
  const chat = await msg.getChat();
  const audios = {
    '/01': 'assuma',
    '/02': 'audioEstourado',
    '/03': 'chipiChapa',
    '/04': 'danielFuiLa',
    '/05': 'eAHomosexualidade',
    '/06': 'fakenaty',
    '/07': 'feiopradesgraca',
  };
  const audio = audios[msg.body];
  if (msg.body && audio !== undefined) {
    const media = MessageMedia.fromFilePath(`./src/audios/${audio}.mp3`);
    await client.sendMessage(chat.id._serialized, media, { sendAudioAsVoice: true });
  } else {
    await msg.reply('Veja a lista outra vez e peça um aúdio válido.');
  }
}

/**
 * @description Resume as ultimas mensagens de uma conversa
 * @param {WAWebJS.Message} msg Mensagem recebida no chat.
 * @param {Client} client Instância do cliente do WhatsApp Web.
 */
async function resumeMessages(client, msg) {
  const chat = await msg.getChat();
  await client.sendMessage(chat.id._serialized, 'Entendido! Vou analisar as últimas mensagens e gerar um resumo.');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: 'You are a bot. Your name is HasturBot.',
  });
  const messages = await chat.fetchMessages({
    limit: 400,
  });

  const textMessages = messages
    .filter((message) => !message.hasMedia)
    .map((message) => ({
      messageText: message.body,
      author: message._data.notifyName || 'Alguém',
    }));

  const formattedMessages = textMessages
    .slice(0, -2)
    .map((message) => ` ${message.messageText} : ${message.author}`)
    .join('\n');

  const prompt = `Resuma a conversa a seguir de forma clara e objetiva, destacando os principais temas abordados. Identifique os participantes pelo nome e mencione suas contribuições mais relevantes. Caso o nome não esteja disponível, utilize "Alguém". Ignore mensagens irrelevantes e priorize as informações mais importantes. O resumo deve ser conciso, mantendo o contexto original da conversa:\n\n${formattedMessages}`;

  try {
    const result = await model.generateContent(prompt, {
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.6,
      },
    });
    const response = await result.response;
    const text = await response.text();

    await client.sendMessage(chat.id._serialized, text).then(() => msg.react('⏳').finally(() => msg.react('✅')));
  } catch (error) {
    await client.sendMessage(chat.id._serialized, 'Desculpe, não consegui processar o resumo no momento.');
  }
}

function formatDate(unixTimeStamp) {
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

module.exports = {
  makeSticker,
  sendAudios,
  formatDate,
  resumeMessages,
};
