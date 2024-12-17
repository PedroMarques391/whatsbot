const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
require('dotenv').config();
const {
  showPastMembers, listMembers,
  join, init, addParticipant,
  removeParticipant, promoteParticipant,
  demoteParticipant,
} = require('./functions/groupFunctions');
const { makeSticker, sendAudios } = require('./functions/generalFunctions');
const { extractTextFromBody } = require('./functions/auxiliaryFunctions');
const { groupIdsAllowed } = require('./functions/utils');
const { DLIntro } = require('./functions/runInSpecificGroup');
const groupMembers = require('../dlMembers.json');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
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
┃￫ Olá @${contact.number}! Eu sou o HasturBot. Todos com comandos devem iniciar com ' / '.
╰╼━══━━━━≺∆≻━━━━══━╾╯

╭•━━━━━≺ Grupos ≻━━━━━•╮
┃￫ /list - Listar os membros do grupo.
┃￫ /past - Mostra os antigos membros do grupo.
╰╼━══━━━━≺∆≻━━━━══━╾╯

╭•━━≺ Administradores ≻━━•╮ 
┃￫ /add + número - Adiciona um participante ao grupo.
┃￫ /rm + número - Remove um participante ao grupo.
┃￫ /promote + número - Promove um membro a Administrador.
┃￫ /demote + número - Rebaixa um administrador a membro.
╰╼━══━━━━≺∆≻━━━━══━╾╯ 

╭•━━━━━━≺ Geral ≻━━━━━━•╮ 
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

  if (groupIdsAllowed.length > 0 && !groupIdsAllowed.includes(chat.id.user)) {
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
  } if (msg.body.startsWith('/test')) {
    const a = await client.getChatById(chat.id_serialized);
    console.log(a);
  } if (msg.body.startsWith('/apt')) {
    if (typeof DLIntro === 'function') {
      await DLIntro(chat, client, groupMembers);
    } else {
      console.log(`
\u001b[1m⚠️  \u001b[31mFunção "DLIntro" não encontrada!\u001b[0m
\u001b[33m============================================================\u001b[0m

\u001b[36m🔧 Para corrigir este problema:\u001b[0m
\u001b[37m- Substitua a função "DLIntro" por uma função personalizada 
  para apresentar os usuários do grupo ou exclua o comando /apt.\u001b[0m
\u001b[32m- Exemplo:\u001b[0m Crie uma função '\u001b[1mpresentGroupMembers\u001b[0m' que recebe 
  os parâmetros necessários: (chat, client, members).

\u001b[36m🚀 Objetivo:\u001b[0m Essa função deve listar ou apresentar os membros 
do grupo de maneira personalizada conforme sua necessidade.

\u001b[36m🔗 Dica:\u001b[0m Garanta que a função está definida ou importada 
corretamente no escopo do projeto.

\u001b[33m============================================================\u001b[0m
                `);
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
    await messageRevoke.reply(`O usuário ${messageRevoke._data.notifyName} apagou a mensagem "${messageRevoke.body}".`, process.env.CLIENT_NUMBER);
  }
});

client.initialize();
