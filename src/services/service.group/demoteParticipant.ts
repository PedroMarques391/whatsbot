import { authorIsAdmin, botIsAdmin, getGroupAdmins, isAuthorOrBot, isNotInGroup, notAValidNumber } from '@/helpers';
import { extractTextFromBody } from '@/utils';
import { Client, GroupChat, Message } from 'whatsapp-web.js';



export async function demoteParticipant(message: Message, chat: GroupChat | any, client: Client) {
    const isBotAdmin = await botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await notAValidNumber(message, '/demote');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const userToDemote = await isNotInGroup(chat, message);
    if (userToDemote) {
        return;
    }

    if (!getGroupAdmins(chat).includes(`${extractTextFromBody(message.body)}@c.us`)) {
        return message.reply('O membro que você deseja rebaixar já está no menor nível. 🙁');
    }
    if (isAuthorOrBot(message)) {
        return message.reply('Você não pode se rebaixar ou tentar rebaixar o Bot.');
    } if (!getGroupAdmins(chat).includes(`${extractTextFromBody(message.body)}@c.us`)) {
        return message.reply('O membro que você deseja rebaixar já está no menor nível. 🙁');
    }
    if (isAuthorOrBot(message)) {
        return message.reply('Você não pode se rebaixar ou tentar rebaixar o Bot.');
    }
    await chat.demoteParticipants([`${extractTextFromBody(message.body)}@c.us`]);
    await client.sendMessage(chat.id._serialized, `Poxa @${extractTextFromBody(message.body)}, você foi rebaixado a membro comum do grupo. Parece que suas atitudes deixaram a desejar. ☹`, { mentions: [`${extractTextFromBody(message.body)}@c.us`] });
}