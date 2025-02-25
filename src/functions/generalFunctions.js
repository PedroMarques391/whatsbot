require('dotenv').config();
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
          msg.from === process.env.CLIENT_NUMBER ? msg.to : msg.from,
          stickerMedia,
          {
            sendMediaAsSticker: true,
            stickerName: `💀Created by ${authorName}`,
            stickerAuthor: 'HasturBot💀',
          },
        );
        await msg.react('✅');
      })
      .on('error', (err) => {
        console.error('Erro na conversão:', err);
      })
      .run();
  } else {
    await msg.react('⏳');

    const stickerMedia = new MessageMedia(media.mimetype, media.data);
    await client.sendMessage(
      msg.from === process.env.CLIENT_NUMBER ? msg.to : msg.from,
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
 * @description Transforma uma imagem em figurinha.
 * @param {WAWebJS.Message} msg Chat do grupo em questão.
 * @param {Client} client Chat do grupo em questão.
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

function formatDate(unixTimeStamp) {
  const date = new Date(unixTimeStamp * 1000);

  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  const hours = (`0${date.getHours()}`).slice(-2);
  const minutes = (`0${date.getMinutes()}`).slice(-2);
  const seconds = (`0${date.getSeconds()}`).slice(-2);

  const formattedTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  console.log(formattedTime);
}

module.exports = {
  makeSticker,
  sendAudios,
  formatDate,
};
