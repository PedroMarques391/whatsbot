import { GroupChat, Message } from "whatsapp-web.js";
import { groups, helpers } from "../../utils";



export async function removeParticipant(message: Message, chat: GroupChat | any) {
    const isBotAdmin = await groups.botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await helpers.isNotAValidNumber(message, '/rm');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await groups.authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const userToRemove = await groups.isNotInGroup(chat, message);
    if (userToRemove) {
        return;
    }
    const canRemove = helpers.isAuthorOrBot(message)
        ? await message.reply('Você não pode se remover ou tentar remover o Bot. 😡')
        : await chat.removeParticipants([`${helpers.extractTextFromBody(message.body)}@c.us`]);
    return canRemove;
}