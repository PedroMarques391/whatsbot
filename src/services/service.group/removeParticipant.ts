import { authorIsAdmin, botIsAdmin, isAuthorOrBot, isNotInGroup, notAValidNumber } from '@/helpers';
import { extractTextFromBody } from '@/utils';
import { GroupChat, Message } from 'whatsapp-web.js';



export async function removeParticipant(message: Message, chat: GroupChat | any) {
    const isBotAdmin = await botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await notAValidNumber(message, '/rm');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const userToRemove = await isNotInGroup(chat, message);
    if (userToRemove) {
        return;
    }
    const canRemove = isAuthorOrBot(message)
        ? await message.reply('Você não pode se remover ou tentar remover o Bot. 😡')
        : await chat.removeParticipants([`${extractTextFromBody(message.body)}@c.us`]);
    return canRemove;
}