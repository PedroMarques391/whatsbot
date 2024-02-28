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
  const chatIds = ['120363046974763940@g.us', '559185100593-1484272786@g.us'];
  try {
    if (chatIds.includes(chatId)) {
      const newMemberId = recipientIds[recipientIds.length - 1];

      const mention = newMemberId.split('@')[0];

      await client.sendMessage(chatId, `Olá @${mention}! Bem-vindo ao grupo. Eu sou o HasturBot, digíte "/start" para ver os comandos disponíveis!`, { mentions: [newMemberId] });
    }
  } catch (error) {
    await client.sendMessage(chatId, 'Algo deu errado :(');
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

    const groupID = ['120363046974763940@g.us', '559185100593-1484272786@g.us'];
    for (let i = 0; i < groupID.length; i++) {
      const media = photo.fromFilePath('./src/img/hasturInit.jpg');

      const messageToSend = 'HasturBot está online agora!\nDigíte "/start" para ver opções.';

      client.sendMessage(groupID[i], media, { caption: messageToSend });
    }

    console.log('Mensagem enviada com sucesso para o grupo:', groupID);
  } catch (error) {
    console.error('Ocorreu um erro ao enviar a mensagem:', error);
  }
}

module.exports = {
  showPastMembers,
  listMembers,
  join,
  init,
};
