const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const {
  showPastMembers, listMembers, join, init,
} = require('./functions/groupFunctions');
const { makeSticker } = require('./functions/generalFunctions');

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
    
  🌟 *Comandos gerais:* 🌟
    
  🔹 🖼️ /sticker - Transforma uma imagem em figurinha. (Envie o comando junto com a imagem)
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
  } if (msg.body.startsWith('Teste')) {

  }
});

// client.on('message_revoke_everyone', async (teste, teste2) => {
//  const chat = (await teste.getChat()).id._serialized;
//  await teste.reply('Tentou apagar a mensagem foi? ');
//  await client.sendMessage(chat, `Eu vi que a mensagem apagada foi "${teste2.body}"`);
// });

// client.on('group_leave', async (notification) => {
//  const chat = await notification.getChat();
//  console.log(notification);
//  console.log(chat);
//  await client.sendMessage(notification.recipientIds[0], `Foi removido do grupo "${chat.name}" otário, mensagem //enviada pelo HasturBot`);
// });

client.initialize();
