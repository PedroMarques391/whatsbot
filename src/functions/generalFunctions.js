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
        ).then((message) => message.react('❤'));
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
    ).then((message) => message.react('❤'));
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
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0.6,

    },
    systemInstruction: 'You are a bot. Your name is HasturBot.',
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

      const groupPrompt = `Analise as mensagens abaixo e elabore um resumo claro e objetivo da conversa no grupo "${chatName}".  
      Destaque os principais temas abordados e identifique os participantes, referindo-se a eles como "participantes" ou "usuários".  
      Priorize as informações mais relevantes e ignore mensagens irrelevantes.  
      No final, adicione uma breve opinião do bot sobre a conversa, com um tom descontraído e irônico.  
      O resumo deve ser conciso, mantendo o contexto original:\n\n${textMessages}`;

      const userPrompt = `Analise as mensagens abaixo e elabore um resumo claro e objetivo da conversa com "${chatName}".  
      Destaque os principais temas abordados e mencione as contribuições mais relevantes do usuário.  
      Priorize as informações mais importantes e ignore mensagens irrelevantes.  
      No final, adicione uma breve opinião do bot sobre a conversa, com um tom descontraído e envolvente.  
      O resumo deve ser conciso, mantendo o contexto original:\n\n${textMessages}`;

      const prompt = chat.isGroup ? groupPrompt : userPrompt;

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
