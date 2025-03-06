const { groupParticipants } = require('./group');
const { extractTextFromBody } = require('./helpers');

require('dotenv').config();

/**
* @description Retorna todos os administradores do grupo.
*/
function isAdmin(chat) {
    const adms = [];
    for (const participant of chat.participants) {
        if (participant.isAdmin) {
            adms.push(`${participant.id.user}@c.us`);
        }
    }
    return adms;
}

/**
* @description Retorna verdadeiro se o bot for administador.
*/
async function botIsAdmin(chat, msg) {
    const admin = isAdmin(chat).includes(process.env.CLIENT_NUMBER);
    if (!admin) {
        await msg.reply('Para executar essa função o bot precisar ser administrador do grupo. 👤');
        return false;
    }
    return true;
}

/**
 * @description Verifica se um numero é válido.
 */
async function isNotAValidNumber(msg, command) {
    if (extractTextFromBody(msg.body) === '' || extractTextFromBody(msg.body).match(/[+\-()]/)) {
        await msg.reply(`Por favor, adicione um número após '${command}' sem caracteres especiais. \nPor exemplo, use '${command} 551188889999'.`);
        return true;
    }
    return false;
}

/**
 * @description Verifica se o autor na mensagem é um administrador.
 */
async function authorIsAdmin(chat, msg) {
    if (!isAdmin(chat).includes(msg.author)) {
        await msg.reply('Poxa 🙁, você precisa ser um administrador para executar esse comando.');
        return false;
    }
    return true;
}

/**
 * @description Retorna verdadeiro se o bot for autor da mensagem.
 */
function isAuthorOrBot(msg) {
    return `${extractTextFromBody(msg.body)}@c.us` === msg.author || `${extractTextFromBody(msg.body)}@c.us` === msg.to;
}

/**
   * @description Retorna verdadeiro se o usuário não está no grupo.
   */
async function isNotInGroup(chat, msg) {
    if (!groupParticipants(chat).includes(`${extractTextFromBody(msg.body)}@c.us`)) {
        await msg.reply(`O número "${extractTextFromBody(msg.body)}" não está presente no grupo.`);
        return true;
    }
    return false;
}

module.exports = {
    authorIsAdmin,
    isAuthorOrBot,
    isNotAValidNumber,
    isNotInGroup,
    botIsAdmin,
    isAdmin,
};
