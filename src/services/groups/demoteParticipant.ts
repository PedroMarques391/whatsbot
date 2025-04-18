import { Client, GroupChat, Message } from "whatsapp-web.js";
import { groups, helpers } from "./../../utils"



export async function demoteParticipant(message: Message, chat: GroupChat | any, client: Client) {
    const isBotAdmin = await groups.botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await helpers.isNotAValidNumber(message, '/demote');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await groups.authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const userToDemote = await groups.isNotInGroup(chat, message);
    if (userToDemote) {
        return;
    }

    if (!groups.getGroupAdmins(chat).includes(`${helpers.extractTextFromBody(message.body)}@c.us`)) {
        return message.reply('O membro que você deseja rebaixar já está no menor nível. 🙁');
    }
    if (helpers.isAuthorOrBot(message)) {
        return message.reply('Você não pode se rebaixar ou tentar rebaixar o Bot.');
    }

    if (!groups.getGroupAdmins(chat).includes(`${helpers.extractTextFromBody(message.body)}@c.us`)) {
        return message.reply('O membro que você deseja rebaixar já está no menor nível. 🙁');
    }
    if (helpers.isAuthorOrBot(message)) {
        return message.reply('Você não pode se rebaixar ou tentar rebaixar o Bot.');
    }
    await chat.demoteParticipants([`${helpers.extractTextFromBody(message.body)}@c.us`]);
    await client.sendMessage(chat.id._serialized, `Poxa @${helpers.extractTextFromBody(message.body)}, você foi rebaixado a membro comum do grupo. Parece que suas atitudes deixaram a desejar. ☹`, { mentions: [`${helpers.extractTextFromBody(message.body)}@c.us`] });
}