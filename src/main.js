const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
require('dotenv').config();
const ytdl = require('ytdl-core');
const {
  showPastMembers, listMembers,
  join, init, addParticipant,
  removeParticipant, promoteParticipant,
  demoteParticipant,
} = require('./functions/groupFunctions');
const { makeSticker, sendAudios } = require('./functions/generalFunctions');
const { extractTextFromBody } = require('./functions/auxiliaryFunctions');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: process.env.EXECUTABLE_PATH,
  },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log(`    
  ╭•╼━━≺∆≻━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾≺∆≻━━━╾•╮ 
  ┃｡˚💀 ￫ Cliente Conectado                                        
  ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━   
  ┃｡˚💀 ￫ Nome do cliente: ${client.info.pushname}              
  ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━   
  ┃｡˚💀 ￫ Telefone do cliente: ${client.info.wid.user}       
  ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━
  ┃｡˚💀 ￫ Plataforma do cliente: ${client.info.platform}
  ╰╼━━━━━━━━╾━━━━━━╾━━━━━━╾≺End≻━═━╾━━━╾━━━━━━╾━━━━━━━━━━━╯

  `);
});

client.on('authenticated', async () => {
  init(client, MessageMedia);
});

client.on('group_join', async (notification) => {
  join(notification, client);
});

client.on('message_create', async (message) => {
  if (message.body === '/start') {
    const chat = await message.getChat();
    const contact = await message.getContact();
    const date = new Date();
    const hours = `${date.getHours()}` < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = `${date.getMinutes()}` < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = `${date.getSeconds()}` < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    const menu = `
╭━━━━━◉   Menu   ◉━━━━━╮ 

  ╔┉｡˚┉═══『💀』═══┉｡˚┉╗    
  ◉━━━━━ HasturBot ━━━━━◉
  ╚┉｡˚┉═══『💀』═══┉｡˚┉╝   
   
 ╰━━━━━━◉*^__~*◉━━━━━━╯

╭•━━━━━━≺ *Infos* ≻━━━━━━•╮ 
┃￫ *Chat:* ${contact.pushname}
┃￫ *Hora:* ${hours}:${minutes}:${seconds}
┃￫ Olá @${contact.number}! Eu sou o HasturBot. Todos com comandos devem iniciar com ' / '.
╰╼━══━━━━≺∆≻━━━━══━╾╯

╭•━━━━━≺ *Grupos* ≻━━━━━•╮
┃￫ /list - Listar os membros do grupo.
┃￫ /past - Mostra os antigos membros do grupo.
╰╼━══━━━━≺∆≻━━━━══━╾╯

╭•━━≺ *Administradores* ≻━━•╮ 
┃￫ /add + número - Adiciona um participante ao grupo.
┃￫ /rm + número - Remove um participante ao grupo.
┃￫ /promote + número - Promove um membro a Administrador.
┃￫ /demote + número - Rebaixa um administrador a membro.
╰╼━══━━━━≺∆≻━━━━══━╾╯ 

╭•━━━━━━≺ *Geral* ≻━━━━━━•╮ 
┃￫ /sticker - Transforma uma imagem em figurinha. (Envie o comando junto com a imagem)
┃￫ /audios - Envia uma lista de áudios.
┃￫ /search + palavra - Pesquisa o que você deseja no google.
┃￫ /images + descrição detalhada - Pesquisa e envia a imagem que você deseja.
╰╼━══━━━━≺∆≻━━━━══━╾╯
    `;
    const media = MessageMedia.fromFilePath('./src/img/hasturProfile.jpg');
    await client.sendMessage(chat.id._serialized, media, {
      caption: menu,
      mentions: [contact.id._serialized],
    });

    await message.react('❤️');
  }
});

client.on('message_create', async (msg) => {
  const chat = await msg.getChat();
  const contact = await msg.getContact();
  if (msg.body === '/list') {
    const allowed = chat.isGroup
      ? listMembers(chat)
      : await msg.reply(`O comando '${msg.body}' só pode ser usado em grupos`);
    return allowed;
  } if (msg.body === '/past') {
    const allowed = chat.isGroup
      ? showPastMembers(chat)
      : await msg.reply(`O comando '${msg.body}' só pode ser usado em grupos`);
    return allowed;
  } if (msg.body.startsWith('/sticker')) {
    makeSticker(msg, client);
  } if (msg.body.startsWith('/add')) {
    const allowed = chat.isGroup
      ? addParticipant(msg, chat)
      : await msg.reply(`O comando '${msg.body}' só pode ser usado em grupos`);
    return allowed;
  } if (msg.body.startsWith('/rm')) {
    const allowed = chat.isGroup
      ? removeParticipant(msg, chat)
      : await msg.reply(`O comando '${msg.body}' só pode ser usado em grupos`);
    return allowed;
  } if (msg.body.startsWith('/promote')) {
    const allowed = chat.isGroup
      ? promoteParticipant(msg, chat, client)
      : await msg.reply(`O comando '${msg.body}' só pode ser usado em grupos`);
    return allowed;
  } if (msg.body.startsWith('/demote')) {
    const allowed = chat.isGroup
      ? demoteParticipant(msg, chat, client)
      : await msg.reply(`O comando '${msg.body}' só pode ser usado em grupos`);
    return allowed;
  } if (msg._data.isViewOnce) {
    const media = await msg.downloadMedia();
    await client.sendMessage(process.env.CLIENT_NUMBER, `Eii, você recebeu uma mensagem de visualização única de *${msg._data.notifyName}*. Vou deixar guardado aqui: \n`);
    await client.sendMessage(process.env.CLIENT_NUMBER, media);
  } if (msg.body === '/audios') {
    await msg.react('🔈');
    await msg.reply('Opa, vou ter os seguintes aúdios disponíveis: \n\n/01 - Assuma\n/02 - Desconhecido\n/03 - Chipi Chipi\n/04 - Fui lá\n/05 - E a Homosexualidade?\n/06 - Fake\n/07 - Feio pra desgraça\n');
  } if (msg.body.startsWith('/search')) {
    const word = extractTextFromBody(msg.body);

    await msg.react('❤');

    const APIKEY = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_API_CTX_GENERAL;

    const URL = await fetch(`https://www.googleapis.com/customsearch/v1?key=${APIKEY}&cx=${cx}&q=${word}`);
    const data = await URL.json();

    if (data.items === undefined) {
      return client.sendMessage(chat.id._serialized, 'Poxa, não achei resultados para essa pesquisa. Tente novamente.');
    }
    await msg.reply('Certo, aqui estão alguns resultados que podem te ajudar: ');
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const resultToSend = `*${item.title}*\n${item.snippet}\n${item.link}`;
      client.sendMessage(chat.id._serialized, resultToSend, { linkPreview: true });
    }
  } if (msg.body.startsWith('/images')) {
    const word = extractTextFromBody(msg.body);
    await msg.react('❤');

    const APIKEY = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_API_CTX_IMAGES;

    const URL = await fetch(`https://www.googleapis.com/customsearch/v1?key=${APIKEY}&cx=${cx}&q=${word}&searchType=image`);
    const data = await URL.json();

    if (!data.items || data.items.length === 0) {
      return client.sendMessage(chat.id._serialized, 'Poxa, não achei resultados para essa pesquisa. Tente novamente.');
    }
    await msg.reply('Opa, achei umas imagens legais aqui. ☺ ☺');
    (await client.sendMessage(chat.id._serialized, 'Aguarde um instante...')).react('⏳');
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      try {
        const media = await MessageMedia.fromUrl(item.link, { filename: 'ImagesByHasturBot' });
        await client.sendMessage(chat.id._serialized, media);
        await new Promise((resolve) => { setTimeout(resolve, 1000); });
      } catch (error) {
        continue;
      }
    }
    await client.sendMessage(chat.id._serialized, 'Prontinho, espero que tenha ajudado!!');
  } if (msg.body.startsWith('/youtubeVideo')) {
    // Funçaõ em teste
    if (extractTextFromBody(msg.body) === '') {
      return client.sendMessage(chat.id._serialized, 'Eu preciso de um link para baixar o vídeo. Tente: *"https://youtu.be/videoID"*');
    }
    const outputFileName = './src/videos/video.mp4';
    await client.sendMessage(chat.id._serialized, 'Baixando vídeo, aguarde um instante..');
    const videoUrl = extractTextFromBody(msg.body);
    const outputStream = fs.createWriteStream(outputFileName);
    try {
      await new Promise((resolve, reject) => {
        ytdl(videoUrl, {
          quality: 'highestvideo',
          filter: 'audioandvideo',
        })
          .on('error', (error) => {
            console.error('Erro ao baixar o vídeo:', error);
            reject(error);
          })
          .on('end', () => {
            console.log('Download do vídeo concluído!');
            resolve();
          })
          .pipe(outputStream);
      });

      const media = MessageMedia.fromFilePath(outputFileName);
      await client.sendMessage(chat.id._serialized, media, { caption: 'Download concluído!' });
    } catch (error) {
      console.error('Erro:', error);
      await client.sendMessage(chat.id._serialized, 'Ocorreu um erro ao baixar o vídeo. Verifique se o link está correto ou se o vídeo não excede o limite de 65mb.');
    }
  } if (msg.body.startsWith('/youtubeAudio')) {
    // FUNÇÃO EM FASE DE TESTE
    if (extractTextFromBody(msg.body) === '') {
      return client.sendMessage(chat.id._serialized, 'Eu preciso de um link para baixar o áudio. Tente: *"https://youtu.be/videoID"*');
    }
    const outputFileName = './src/audios/audio.mp3';
    await client.sendMessage(chat.id._serialized, 'Baixando áudio, aguarde um instante..');
    const videoUrl = extractTextFromBody(msg.body);
    const outputStream = fs.createWriteStream(outputFileName);
    try {
      await new Promise((resolve, reject) => {
        ytdl(videoUrl, {
          filter: 'audioonly',
        })
          .on('error', (error) => {
            console.error('Erro ao baixar o áudio:', error);
            reject(error);
          })
          .on('end', () => {
            console.log('Download do áudio concluído!');
            resolve();
          })
          .pipe(outputStream);
      });
      await new Promise((resolve) => { setTimeout(resolve, 1000); });
      const media = MessageMedia.fromFilePath('./src/audios/audio.mp3');
      await client.sendMessage(chat.id._serialized, media, { sendAudioAsVoice: false });
    } catch (error) {
      console.error('Erro:', error);
      await client.sendMessage(chat.id._serialized, 'Ocorreu um erro ao baixar o áudio. Verifique se o link está correto ou se o arquivo não excede o limite de 65mb.');
    }
  } if (msg.body.startsWith('/block')) {
    try {
      const contactIdToBlock = await client.getContactById(`${extractTextFromBody(msg.body)}@c.us`);
      if (contactIdToBlock.isBlocked) {
        const unBlock = await contactIdToBlock.unblock();
        await client.sendMessage(chat.id._serialized, `Prontinho, *${contact.pushname}*, *${contactIdToBlock.pushname}* foi desbloqueado com sucesso.`);
        return unBlock;
      }
      const block = await contactIdToBlock.block();
      await client.sendMessage(chat.id._serialized, `Prontinho, *${contact.pushname}*, *${contactIdToBlock.pushname}* foi bloqueado com sucesso. Para desbloquear execute o mesmo comando.`);
      return block;
    } catch (error) {
      console.log(error);
      await client.sendMessage(chat.id._serialized, 'Tive algum problema para bloquear o contato, ou já está bloqueado, ou o numero é inválido.');
    }
  }
});

client.on('message_create', async (msg) => {
  if (msg.body.startsWith('/0')) {
    sendAudios(msg, MessageMedia, client);
  }
});

client.on('message_revoke_everyone', async (message, messageRevoke) => {
  if (!message.hasMedia) {
    await messageRevoke.reply(`O usuário ${messageRevoke._data.notifyName} apagou a mensagem "*${messageRevoke.body}*".`, process.env.CLIENT_NUMBER);
  }
});

client.initialize();
