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
const {
  makeSticker, sendAudios,
  resumeMessages, response,
} = require('./functions/generalFunctions');
const {
  rejectCallResponses,
  firstInteractionMessages,
  botResponses,
  extractTextFromBody,
  saveUsers,
  usersResponded,
  sendGroupMessages,
} = require('./utils');
const { geminiResponse } = require('./model/geminiModel');

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
  ┃｡˚⭐ ￫ Cliente Conectado                                        
  ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━   
  ┃｡˚⭐ ￫ Nome do cliente: ${client.info.pushname}              
  ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━   
  ┃｡˚⭐ ￫ Telefone do cliente: ${client.info.wid.user}       
  ┃━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━╾━━━━━━
  ┃｡˚⭐ ￫ Plataforma do cliente: ${client.info.platform === 'iphone' ? 'IOS' : client.info.platform}
  ╰╼━━━━━━━━╾━━━━━━╾━━━━━━╾≺End≻━═━╾━━━╾━━━━━━╾━━━━━━━━━━━╯
  `);
});

client.on('authenticated', async () => {
  await init(client, MessageMedia);
});

client.on('group_join', async (notification) => {
  await join(notification, client);
});

client.on('call', async (call) => {
  const rejectCall = rejectCallResponses[Math.floor(Math.random() * rejectCallResponses.length)];
  await call.reject();

  await client.sendMessage(
    call.from,
    rejectCall,
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
╭━━━ ◉ *Menu* ◉ ━━━╮

◉━━━ *AdaBot* ━━━◉  
🌺 Olá, @${contact.number}! Eu sou a Ada.  
🌺 Todos os comandos devem iniciar com " / ".  
🌺 Chat: ${contact.pushname} 
🌺 Hora: ${hours}:${minutes}:${seconds}  

╭─≺ *Infos* ≻─╮  
┃ ➤ /start - Mostrar este menu.  
┃ ➤ /info - Ver informações do bot.  
╰─────≺∆≻─────╯  

╭─≺ *Grupos* ≻─╮  
┃ ➤ /list - Listar membros do grupo.  
┃ ➤ /past - Mostrar ex-membros do grupo.  
╰─────≺∆≻─────╯  

╭─≺ *Administradores* ≻─╮  
┃ ➤ /add + número - Adicionar participante.  
┃ ➤ /rm + número - Remover participante.  
┃ ➤ /promote + número - Promover a admin.  
┃ ➤ /demote + número - Rebaixar admin.  
╰──────≺∆≻──────╯  

╭─≺ *Geral* ≻─╮  
┃ ➤ /sticker - Criar figurinha (envie imagem/vídeo).  
┃ ➤ /resume - Resumir últimas mensagens.  
┃ ➤ /audios - Lista de áudios disponíveis.  
┃ ➤ /search + palavra - Pesquisar no Google.  
┃ ➤ /images + descrição - Buscar imagens.  
╰─────≺∆≻─────╯  

╭─≺ *Converse Comigo* ≻─╮  
┃ 💬 Me chame carinhosamente:  
┃    Exemplo → *Ada, qual sua música favorita?* 🎶  
┃ 🐾 Eu vou responder com muito amor e fofura! 💕  
╰────────────╯

╰━━━◉ ^__^ ◉━━━╯

`;
    const media = MessageMedia.fromFilePath('./src/img/adaProfile.jpg');
    await client.sendMessage(chat.id._serialized, media, {
      caption: menu,
      mentions: [contact.id._serialized],
    });

    await message.react('❤️');
  }
});

client.on('message_create', async (msg) => {
  const chat = await msg.getChat();
  const chats = await client.getChats();

  const quotedMessage = await msg.getQuotedMessage();

  if (msg.from.includes('@c.us') && !msg.fromMe) {
    const getResponse = firstInteractionMessages[
      Math.floor(
        Math.random() * firstInteractionMessages.length,
      )];
    if (!usersResponded.has(msg.from)) {
      await client.sendMessage(chat.id._serialized, getResponse);
      usersResponded.add(msg.from);
      saveUsers();
      return;
    }
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
  } if (msg.body.toLowerCase().startsWith('/sticker') || msg.body.toLowerCase() === '/s') {
    const isQuotedMessage = msg.hasQuotedMsg
      ? makeSticker(quotedMessage, client)
      : makeSticker(msg, client);
    await isQuotedMessage;
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
        const media = await MessageMedia.fromUrl(item.link, { filename: 'ImagesByAdaBot' });
        await client.sendMessage(chat.id._serialized, media);
        await new Promise((resolve) => { setTimeout(resolve, 1000); });
      } catch (error) {
        continue;
      }
    }
    await client.sendMessage(chat.id._serialized, 'Prontinho, espero que tenha ajudado!!');
  } if (msg.body.startsWith('/resume')) {
    await resumeMessages(client, msg);
    return;
  } if (msg.hasQuotedMsg) {
    const quoted = await msg.getQuotedMessage();
    if (quoted.id.fromMe) {
      console.log('Ada disse:', quoted.body);
      console.log('Usuário respondeu:', msg.body);

      const response = await geminiResponse(msg.body);
      msg.reply(response);
    }
  } if (!msg.fromMe) {
    const greetingRegex = chat.isGroup
      ? /\b(o{1,}i+|ol+[áa]+|o{2,}p+a+|e+\s*a+[íi]+|f+a+l+a+|s+a+l+v+e+|b+o+m+\s*d+i+a+|b+o+a+\s*t+a+r+d+e+|b+o+a+\s*n+o+i+t+e+|h+e+y+|h+i+|h+e+l+l+o+|y+o+|e+a+e+|e+a+i+|o+i+e+|o+e{2,})\s*(ada|adabot)\b/i
      : /\b(o{1,}i+|o{2,}l+[áa]+|o{2,}p+a+|e+\s*a+[íi]+|f+a+l+a+|s+a+l+v+e+|b+o+m+\s*d+i+a+|b+o+a+\s*t+a+r+d+e+|b+o+a+\s*n+o+i+t+e+|h+e+y+|h+i+|h+e+l+l+o+|y+o+|e+a+e+|e+a+i+|o+i+e+|o+e{2,})\b/i;

    if (greetingRegex.test(msg.body.toLowerCase())
      || msg.body.toLowerCase() === 'ada'
      || msg.body.toLowerCase() === 'adabot'
      || msg.body.startsWith(`@${process.env.CLIENT_NUMBER.split('@')[0]}`)

    ) {
      const getRandomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      await msg.reply(getRandomResponse);
      return;
    }
    if (msg.body.toLowerCase().startsWith('adabot')
      || msg.body.toLowerCase().startsWith('ada')
    ) {
      await response(msg, 1.0, 200);
    }
  } if (msg.fromMe && msg.body.startsWith('/sendUpdate')) {
    const groups = chats.filter((chat) => chat.isGroup).map((chat) => chat.id._serialized);
    await sendGroupMessages(groups, client);
  }
});

client.on('message_create', async (msg) => {
  if (msg.body.startsWith('/0')) {
    sendAudios(msg, client);
  }
});

client.on('message_revoke_everyone', async (message, messageRevoke) => {
  if (!message.hasMedia) {
    await messageRevoke.reply(`O usuário ${message._data.notifyName} apagou a mensagem "${messageRevoke.body}".`, process.env.CLIENT_NUMBER);
  }
});

client.initialize();
