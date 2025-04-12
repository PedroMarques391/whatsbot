const { MessageMedia } = require('whatsapp-web.js');
const { delay } = require('./helpers');
const { adaUpdateMessage } = require('./messages');

/**
 * @description Retorna todos os participantes do grupo.
 */
function groupParticipants(chat) {
    const participants = [];
    for (const participant of chat.participants) {
        participants.push(`${participant.id.user}@c.us`);
    }
    return participants;
}

/**
 * Envia mensagens para uma lista de grupos usando o cliente fornecido.
 *
 * @async
 * @function sendGroupMessages
 * @param {string[]} groups - Um array de identificadores de grupos para enviar mensagens.
 * @param {import('wwebjs').Client} client - A instância do cliente WhatsApp Web JS.
 * @returns {Promise<void>} Resolve quando todas as mensagens forem enviadas.
 */
const sendGroupMessages = async (groups, client) => {
    const media = MessageMedia.fromFilePath('./src/img/adaUpdate.jpg');
    for (const group of groups) {
        await client.sendMessage(group, media, { caption: adaUpdateMessage });
        await delay(2000);
    }
};

module.exports = {
    groupParticipants,
    sendGroupMessages,
};
