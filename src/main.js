const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
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
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('======================');
  console.log('Cliente conectado!');
  console.log('======================');
  console.log(`Nome do cliente: ${client.info.pushname}`);
  console.log('======================');
  console.log(`Telefone do cliente: ${client.info.wid.user}`);
  console.log('======================');
  console.log(`Plataforma do cliente: ${client.info.platform}`);
  console.log('======================');
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
    const isUser = contact.isWAContact;
    console.log(isUser);
    console.log(message);
    console.log('=========================================================');
    console.log(chat);
    console.log('=========================================================');
    console.log(contact);
    const media = MessageMedia.fromFilePath('./src/img/hasturProfile.jpg');
    await client.sendMessage(chat.id._serialized, media, {
      caption: `Olá @${contact.number}! Eu sou o HasturBot.\n\n Todos com comandos devem iniciar com ' / '.
    
  🌟 *Comandos para grupos:* 🌟

  🔹 👥 /list - Listar os membros do grupo.
  🔹 🕰️ /past - Mostra os antigos membros do grupo.

  🌟 *Comandos para administradores:* 🌟

  🔹 ➕ /add + número - Adiciona um participante ao grupo.
  🔹 ➖ /rm + número - Remove um participante ao grupo.
  🔹 ⬆ /promote + número - Promove um membro a Administrador.
  🔹 ⬇ /demote + número - Rebaixa um administrador a membro.
    
  🌟 *Comandos gerais:* 🌟
    
  🔹 🖼️ /sticker - Transforma uma imagem em figurinha. (Envie o comando junto com a imagem)
  🔹 🖼️ /audios - Envia uma lista de audíos.
  🔹 🖼️ /search + palavra - Pesquisa o que você deseja no google.
  🔹 🖼️ /images + descrição detalhada - Pesquisa e envia a imagem que você deseja.
    `,
      mentions: [contact.id._serialized],
    });

    await message.react('❤️');
  } else if (message.author === '558596894024@c.us') {
    await message.reply('Oii gatinha ❤️❤️');
    await message.react('❤️');
  }
});

client.on('message_create', async (msg) => {
  const chat = await msg.getChat();
  const contact = await msg.getContact();
  // console.log(msg);
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
  } if (msg._data.isViewOnce && msg.type === 'image') {
    const media = await msg.downloadMedia();
    console.log(media);
    await client.sendMessage('559185480955@c.us', `Eii, você recebeu uma mensagem de visualização única de *${msg._data.notifyName}*. Vou deixar guardado aqui: \n`);
    await client.sendMessage('559185480955@c.us', media);
  } if (msg.body === '/audios') {
    await msg.react('🔈');
    await msg.reply('Opa, vou ter os seguintes aúdios disponíveis: \n\n/01 - Assuma\n/02 - Desconhecido\n/03 - Chipi Chipi\n/04 - Fui lá\n/05 - E a Homosexualidade?\n/06 - Fake\n/07 - Feio pra desgraça\n');
  } if (msg.body.startsWith('/search')) {
    const word = extractTextFromBody(msg.body);

    msg.react('❤');

    const APIKEY = 'AIzaSyC09oEbGT_TyuXJCWQv7_e6Fvw0aeDRO4w';

    const cx = '24f481bb12ac84f48';

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
    msg.react('❤');

    const APIKEY = 'AIzaSyC09oEbGT_TyuXJCWQv7_e6Fvw0aeDRO4w';

    const cx = '45288a2716f094d75';

    const URL = await fetch(`https://www.googleapis.com/customsearch/v1?key=${APIKEY}&cx=${cx}&q=${word}&searchType=image`);
    const data = await URL.json();

    if (!data.items || data.items.length === 0) {
      return client.sendMessage(chat.id._serialized, 'Poxa, não achei resultados para essa pesquisa. Tente novamente.');
    }
    await msg.reply('Opa, achei umas imagens legais aqui. ☺ ☺');
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
    await client.sendMessage(chat.id._serialized, 'Espero que tenha ajudado!!');
  }
});

client.on('message_create', async (msg) => {
  if (msg.body.startsWith('/0')) {
    sendAudios(msg, MessageMedia, client);
  }
});

client.on('message_edit', async (message, _, prevBody) => {
  await message.reply(`Eii, eu vi que você editou uma mensagem. Mas registrei aqui.\n\nAntiga Mensagem: "*${prevBody}*".`);
});

client.on('message_revoke_everyone', async (message, messageRevoke) => {
  if (!message.hasMedia) {
    await messageRevoke.reply(`O usuário ${messageRevoke._data.notifyName} apagou a mensagem "*${messageRevoke.body}*".`, '559185480955@c.us');
  }
});

client.initialize();
