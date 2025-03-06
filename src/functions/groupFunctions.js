require('dotenv').config();
const {
  botIsAdmin, isNotAValidNumber, authorIsAdmin,
  extractTextFromBody, groupParticipants,
  isNotInGroup, isAuthorOrBot, isAdmin,
} = require('../utils');

/**
 * @description Mostra os membros antigos de um grupo.
 * @param {WAWebJS.Chat} chat Chat do grupo em questão.
 */
async function showPastMembers(chat) {
  const pastParticipants = await chat.groupMetadata.pastParticipants;
  let message = 'Participantes anteriores:\n';
  pastParticipants.forEach((participant) => {
    const exit = new Date(participant.leaveTs * 1000);
    const day = exit.getDate();
    const month = exit.getMonth() + 1;
    const year = exit.getFullYear();
    const newDate = `${day}/${month}/${year}`;
    message += `\n Numero: ${participant.id.user}\nQuando saiu: ${newDate}\nMotivo de saída: ${participant.leaveReason}\n------------------------------------------
                `;
  });
  await chat.sendMessage(message);
}
/**
 * @description Marca todos os usuários de um grupo.
 * @param {WAWebJS.Chat} chat Chat do grupo em questão.
 */
async function listMembers(chat) {
  let text = `Atenção membros do ${chat.name}!\n`;
  const mentions = [];

  for (const participant of chat.participants) {
    mentions.push(`${participant.id.user}@c.us`);
    text += `@${participant.id.user} `;
  }
  await chat.sendMessage(text, { mentions });
}
/**
 * @description Função de boas vindas de usuário.
 * @param { WAWebJS.GroupNotification} notification Acesso as notificações de grupo.
 * @param { Client } client Acesso as funções da classe Client.
*/
async function join(notification, client) {
  const { recipientIds, chatId } = notification;
  try {
    const newMemberId = recipientIds[recipientIds.length - 1];
    const mention = newMemberId.split('@')[0];

    if (newMemberId === client.info.wid._serialized) {
      await client.sendMessage(
        chatId,
        '🌸✨ Olá, pessoal! Eu sou a *AdaBot*, estou aqui para ajudar e deixar tudo mais divertido! 💖 Digite "/start" para ver o que posso fazer. 😊',
      );
    }
    if (newMemberId !== client.info.wid._serialized) {
      await client.sendMessage(
        chatId,
        `🌸✨ Olá, @${mention}! Seja muito bem-vindo(a) ao grupo! ✨🌸 Eu sou a *AdaBot*, estou aqui para ajudar e deixar tudo mais divertido! 💖 Digite "/start" para ver todos os comandos disponíveis e aproveitar ao máximo! 😊`,
        { mentions: [newMemberId] },
      );
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem de boas-vindas:', error);
  }
}
/**
 * @description Marca todos os usuários de um grupo.
 * @param { MessageMedia} photo Acesso as funções da classe MessageMedia
 * @param { Client } client Acesso as funções da classe Client
 */
async function init(client, photo) {
  try {
    await new Promise((resolve) => { setTimeout(resolve, 2000); });

    const groupID = process.env.GROUPS_IDS.split(',');
    for (let i = 0; i < groupID.length; i++) {
      const media = photo.fromFilePath('./src/img/adaInit.jpeg');

      const messageToSend = '🌸✨*AdaBot está online!*✨🌸';

      await client.sendMessage(`${groupID[i]}@g.us`, media, { caption: messageToSend });
    }

    console.log('Mensagem enviada com sucesso para o grupo:', groupID);
  } catch (error) {
    console.error('Ocorreu um erro ao enviar a mensagem:', error);
  }
}
/**
 * @description Adiciona um usuário no grupo
 * @param { WAWebJS.Message} msg Acesso as funções da classe MessageMedia
 * @param { WAWebJS.Chat } chat Acesso as funções da classe Client
 */
async function addParticipant(msg, chat) {
  const isBotAdmin = await botIsAdmin(chat, msg);
  if (!isBotAdmin) {
    return;
  }
  const notValid = await isNotAValidNumber(msg, '/add');
  if (notValid) {
    return;
  }
  const messageAuthorIsAdmin = await authorIsAdmin(chat, msg);
  if (!messageAuthorIsAdmin) {
    return;
  }
  const phoneRegex = /^\d{12,}$/;
  if (phoneRegex.test(extractTextFromBody(msg.body))) {
    if (groupParticipants(chat).includes(`${extractTextFromBody(msg.body)}@c.us`)) {
      return msg.reply(`O número ${extractTextFromBody(msg.body)} já está no grupo. 😚`);
    }
    return chat.addParticipants([`${extractTextFromBody(msg.body)}@c.us`]);
  }
  await msg.reply('O número de telefone que você digitou não parece ser válido. Por favor, verifique e tente novamente.');
}
/**
 * @description Remove um usuário do grupo.
 * @param { WAWebJS.Message} msg Acesso as funções da classe MessageMedia
 * @param { WAWebJS.Chat } chat Acesso as funções da classe Client
 */
async function removeParticipant(msg, chat) {
  const isBotAdmin = await botIsAdmin(chat, msg);
  if (!isBotAdmin) {
    return;
  }
  const notValid = await isNotAValidNumber(msg, '/rm');
  if (notValid) {
    return;
  }
  const messageAuthorIsAdmin = await authorIsAdmin(chat, msg);
  if (!messageAuthorIsAdmin) {
    return;
  }
  const userToRemove = await isNotInGroup(chat, msg);
  if (userToRemove) {
    return;
  }
  const canRemove = isAuthorOrBot(msg)
    ? await msg.reply('Você não pode se remover ou tentar remover o Bot. 😡')
    : await chat.removeParticipants([`${extractTextFromBody(msg.body)}@c.us`]);
  return canRemove;
}
/**
 * @description Promover usuário a administrador.
 * @param { WAWebJS.Message} msg Acesso as funções da classe MessageMedia
 * @param { WAWebJS.Chat } chat Acesso as funções da classe Client
 * @param { Client } client Acesso as funções da classe Client.
 */
async function promoteParticipant(msg, chat, client) {
  const isBotAdmin = await botIsAdmin(chat, msg);
  if (!isBotAdmin) {
    return;
  }
  const notValid = await isNotAValidNumber(msg, '/promote');
  if (notValid) {
    return;
  }
  const messageAuthorIsAdmin = await authorIsAdmin(chat, msg);
  if (!messageAuthorIsAdmin) {
    return;
  }
  const userPromove = await isNotInGroup(chat, msg);
  if (userPromove) {
    return;
  }
  if (isAdmin(chat).includes(`${extractTextFromBody(msg.body)}@c.us`)) {
    return msg.reply('O membro que você deseja promover já é um administrador. 🙁');
  }
  await chat.promoteParticipants([`${extractTextFromBody(msg.body)}@c.us`]);
  await client.sendMessage(chat.id._serialized, `Parabéns @${extractTextFromBody(msg.body)}, você foi promovido a administrador do grupo. Contamos com você! 😄🥳🎉`, { mentions: [`${extractTextFromBody(msg.body)}@c.us`] });
}

async function demoteParticipant(msg, chat, client) {
  const isBotAdmin = await botIsAdmin(chat, msg);
  if (!isBotAdmin) {
    return;
  }
  const notValid = await isNotAValidNumber(msg, '/demote');
  if (notValid) {
    return;
  }
  const messageAuthorIsAdmin = await authorIsAdmin(chat, msg);
  if (!messageAuthorIsAdmin) {
    return;
  }
  const userToDemote = await isNotInGroup(chat, msg);
  if (userToDemote) {
    return;
  }

  if (!isAdmin(chat).includes(`${extractTextFromBody(msg.body)}@c.us`)) {
    return msg.reply('O membro que você deseja rebaixar já está no menor nível. 🙁');
  }
  if (isAuthorOrBot(msg)) {
    return msg.reply('Você não pode se rebaixar ou tentar rebaixar o Bot.');
  }

  if (!isAdmin(chat).includes(`${extractTextFromBody(msg.body)}@c.us`)) {
    return msg.reply('O membro que você deseja rebaixar já está no menor nível. 🙁');
  }
  if (isAuthorOrBot(msg)) {
    return msg.reply('Você não pode se rebaixar ou tentar rebaixar o Bot.');
  }
  await chat.demoteParticipants([`${extractTextFromBody(msg.body)}@c.us`]);
  await client.sendMessage(chat.id._serialized, `Poxa @${extractTextFromBody(msg.body)}, você foi rebaixado a membro comum do grupo. Parece que suas atitudes deixaram a desejar. ☹`, { mentions: [`${extractTextFromBody(msg.body)}@c.us`] });
}

module.exports = {
  showPastMembers,
  listMembers,
  join,
  init,
  addParticipant,
  removeParticipant,
  promoteParticipant,
  demoteParticipant,
};
