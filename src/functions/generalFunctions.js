require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const { groupPrompt, userPrompt, sendStickerErrors } = require('../utils/messages');

/**
 * @description Transforma uma imagem em figurinha.
 * @param {WAWebJS.Message} msg Chat do grupo em questão.
 * @param {Client} client Chat do grupo em questão.
 */

async function makeSticker(msg, client) {
  const chat = await msg.getChat();
  const media = await msg.downloadMedia();
  const authorName = msg._data.notifyName || 'Bot';
  const errorMessage = sendStickerErrors[Math.floor(Math.random() * sendStickerErrors.length)];
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
        const stats = fs.statSync(outputPath);
        if (stats.size >= 1000000) {
          await client.sendMessage(chat.id._serialized, errorMessage).then((message) => message.react('😢'));
          return;
        }
        await client.sendMessage(
          chat.id._serialized,
          stickerMedia,
          {
            sendMediaAsSticker: true,
            stickerName: `💀Created by ${authorName}`,
            stickerAuthor: 'HasturBot💀',
          },
        ).then((message) => message.react('❤'));
        await msg.react('✅');
      })
      .on('error', async () => {
        await client.sendMessage(chat.id._serialized, 'Erro na conversão.');
      })
      .run();
    return;
  }
  if (msg.type === 'image') {
    await msg.react('⏳');
    const stickerMedia = new MessageMedia(media.mimetype, media.data);
    const buffer = Buffer.from(media.data, 'base64');
    const size = buffer.length;

    if (size >= 1000000) {
      await client.sendMessage(chat.id._serialized, errorMessage).then((message) => message.react('😢'));
      return;
    }
    await client.sendMessage(
      chat.id._serialized,
      stickerMedia,
      {
        sendMediaAsSticker: true,
        stickerName: `💀Created by ${authorName}`,
        stickerAuthor: 'HasturBot💀',
      },
    ).then((message) => message.react('❤'));
    return msg.react('✅');
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
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.8,
      topP: 0.9,
      topK: 40,
      presencePenalty: 0.4,
      frequencyPenalty: 0.4,
    },
    systemInstruction: 'Você é HasturBot, um bot de whatsapp que conversas de forma natural, envolvente e objetiva.',
  });
  const chat = await msg.getChat();
  const contact = await client.getContactById(chat.id._serialized);

  await client.sendMessage(chat.id._serialized, 'Entendido! Vou analisar as últimas mensagens e gerar um resumo.')
    .then(async (message) => {
      await message.react('⏳');

      const messages = await chat.fetchMessages({ limit: 500 });

      const textMessages = messages
        .filter((textMessage) => !textMessage.hasMedia)
        .map((textMessage) => textMessage.body)
        .join('\n');
      await message.react('⌛');

      const chatName = chat.isGroup ? chat.groupMetadata.subject : contact.pushname;

      const prompt = chat.isGroup
        ? groupPrompt(chatName, textMessages)
        : userPrompt(chatName, textMessages);

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        await message.react('✅');

        await client.sendMessage(chat.id._serialized, text);
      } catch (error) {
        await message.react('❌');
        await client.sendMessage(chat.id._serialized, 'Desculpe, não consegui processar o resumo no momento.');
      }
    });
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
