require('dotenv').config();
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const { resumePrompt, sendStickerErrors, resumeErrorMessages } = require('../utils/messages');
const { geminiResponse } = require('../model/geminiModel');
const { extractTextFromBody } = require('../utils');

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
      .outputOption('-vf scale=512:512:force_original_aspect_ratio=increase,crop=512:512')
      .fps(12)
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
            stickerName: `🌸Created by ${authorName}`,
            stickerAuthor: 'AdaBot🌸',
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
        stickerName: `🌸Created by ${authorName}`,
        stickerAuthor: 'AdaBot🌸',
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
  const chat = await msg.getChat();

  await client.sendMessage(chat.id._serialized, 'Entendido! Vou analisar as últimas mensagens e gerar um resumo.')
    .then(async (message) => {
      await message.react('⏳');

      const messages = await chat.fetchMessages({ limit: 500 });
      const textMessages = messages
        .filter((textMessage) => !textMessage.hasMedia && !textMessage.fromMe && !textMessage.body.startsWith('/'))
        .map((textMessage) => textMessage.body);

      if (textMessages.length < 20) {
        await message.react('✅');
        const randomMessages = resumeErrorMessages[
          Math.floor(Math.random() * resumeErrorMessages.length)];
        await client.sendMessage(chat.id._serialized, randomMessages)
          .then((msgToReact) => msgToReact.react('😥'))
          .finally(async () => {
            await message.react('😥');
          });
        return;
      }
      await message.react('⌛');

      const prompt = resumePrompt(textMessages);

      try {
        const text = await geminiResponse(prompt, 0.5, 500);

        await message.react('✅');

        await client.sendMessage(chat.id._serialized, text);
      } catch (error) {
        await message.react('❌');
        await client.sendMessage(chat.id._serialized, 'Desculpe, não consegui processar o resumo no momento. 😢');
      }
    });
}

async function response(msg, temperature, maxOutputTokens) {
  try {
    const question = extractTextFromBody(msg.body);

    const text = await geminiResponse(question, temperature, maxOutputTokens);

    await msg.react('✅');

    await msg.reply(text);
  } catch (error) {
    await msg.reply('Desculpe, não sei como responder isso. 😫😫');
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
  response,
};
