/* eslint-disable no-console */
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
require('dotenv').config();
const {
  showPastMembers, listMembers,
  join, init, addParticipant,
  removeParticipant, promoteParticipant,
  demoteParticipant,
} = require('./functions/groupFunctions');
const { makeSticker, sendAudios, resumeMessages } = require('./functions/generalFunctions');
const { extractTextFromBody } = require('./functions/auxiliaryFunctions');
const { groupIdsAllowed } = require('./functions/utils');
const { botResponses } = require('./utils/messages');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: process.env.CHROME_PATH,
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
  ┃｡˚💀 ￫ Plataforma do cliente: ${client.info.platform === 'iphone' ? 'IOS' : client.info.platform}
  ╰╼━━━━━━━━╾━━━━━━╾━━━━━━╾≺End≻━═━╾━━━╾━━━━━━╾━━━━━━━━━━━╯

  `);
});

client.on('authenticated', async () => {
  await init(client, MessageMedia);
});

client.on('group_join', async (notification) => {
  const chat = await notification.getChat();
  if (groupIdsAllowed.length > 0 && !groupIdsAllowed.includes(chat.id.user)) {
    return;
  }
  await join(notification, client, chat);
});

client.on('call', async (call) => {
  console.log(call);
  await call.reject();

  await client.sendMessage(
    call.from,
    'O bot rejeita ligaçãoes automaticamente, mas se ele estiver por perto ele jaja fala com você\ncalma ai',
  );
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
     
   ╰━━━━━━◉^__~◉━━━━━━╯

  ╭•━━━━━━≺ Infos ≻━━━━━━•╮ 
  ┃￫ Chat: ${contact.pushname}
  ┃￫ Hora: ${hours}:${minutes}:${seconds}
  ┃￫ Olá @${contact.number}! Eu sou o HasturBot. Todos os comandos devem iniciar com ' / '.
  ╰╼━══━━━━≺∆≻━━━━══━╾╯

  ╭•━━━━━≺ Grupos ≻━━━━━•╮
  ┃￫ /list - Listar os membros do grupo.
  ┃￫ /past - Mostrar os antigos membros do grupo.
  ╰╼━══━━━━≺∆≻━━━━══━╾╯

  ╭•━━≺ Administradores ≻━━•╮ 
  ┃￫ /add + número - Adicionar um participante ao grupo.
  ┃￫ /rm + número - Remover um participante do grupo.
  ┃￫ /promote + número - Promover um membro a Administrador.
  ┃￫ /demote + número - Rebaixar um administrador a membro.
  ╰╼━══━━━━≺∆≻━━━━══━╾╯ 

  ╭•━━━━━━≺ Geral ≻━━━━━━•╮ 
  ┃￫ /sticker - Transformar uma imagem em figurinha. (Envie o comando junto com a imagem ou vídeo).
  ┃￫ /resume - Resumir as últimas mensagens da conversa.
  ┃￫ /audios - Enviar uma lista de áudios.
  ┃￫ /search + palavra - Pesquisar o que você deseja no Google.
  ┃￫ /images + descrição detalhada - Pesquisar e enviar a imagem que você deseja.
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

  // const chats = await client.getChats();
  // const groupChats = chats
  //   .filter((group) => chat.isGroup)
  //   .map((group) => ({ name: chat.name, id: chat.id._serialized }));
  // console.log(groupChats);

  if (chat.isGroup && groupIdsAllowed.length > 0 && !groupIdsAllowed.includes(chat.id.user)) {
    console.log('comando bloqueado');
    return;
  }

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
  } if (msg.body.startsWith('/sticker') || msg.body === '/s') {
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
    await client.sendMessage(process.env.CLIENT_NUMBER, `Eii, você recebeu uma mensagem de visualização única de ${msg._data.notifyName}. Vou deixar guardado aqui: \n`);
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
      const resultToSend = `${item.title}\n${item.snippet}\n${item.link}`;
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
    await client.sendMessage(chat.id._serialized, 'Aguarde um instante...').then((message) => message.react('⏳'));
    console.log(data.items);
    for (let i = 0; i < 5; i++) {
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
  } if (msg.body.startsWith('/block')) {
    try {
      const contactIdToBlock = await client.getContactById(`${extractTextFromBody(msg.body)}@c.us`);
      if (contactIdToBlock.isBlocked) {
        const unBlock = await contactIdToBlock.unblock();
        await client.sendMessage(chat.id._serialized, `Prontinho, ${contact.pushname}, ${contactIdToBlock.pushname} foi desbloqueado com sucesso.`);
        return unBlock;
      }
      const block = await contactIdToBlock.block();
      await client.sendMessage(chat.id._serialized, `Prontinho, ${contact.pushname}, ${contactIdToBlock.pushname} foi bloqueado com sucesso. Para desbloquear execute o mesmo comando.`);
      return block;
    } catch (error) {
      console.log(error);
      await client.sendMessage(chat.id._serialized, 'Tive algum problema para bloquear o contato, ou já está bloqueado, ou o numero é inválido.');
    }
  } if (msg.body.startsWith('/resume')) {
    await resumeMessages(client, msg);
    return;
  } if (msg.body.startsWith('/test')) {
    const messages = await chat.fetchMessages({
      limit: 10,
    });
    console.log(messages);
  } if (msg.body.toLowerCase().startsWith('hasturbot') || msg.body.startsWith(`@${process.env.CLIENT_NUMBER.split('@')[0]}`)) {
    const getRandomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
    await msg.reply(getRandomResponse);
  }
});

client.on('message_create', async (msg) => {
  if (msg.body.startsWith('/0')) {
    sendAudios(msg, client);
  }
});

client.on('message_revoke_everyone', async (message, messageRevoke) => {
  if (!message.hasMedia) {
    await messageRevoke.reply(`O usuário ${messageRevoke._data.notifyName} apagou a mensagem "${messageRevoke.body}".`, process.env.CLIENT_NUMBER);
  }
});

client.initialize();
