import { authorIsAdmin, botIsAdmin, isAuthorOrBot, isNotInGroup, notAValidNumber } from '@/helpers';
import { extractTextFromBody } from '@/utils';
import { GroupChat, Message } from 'whatsapp-web.js';



export async function removeParticipant(message: Message, chat: GroupChat) {
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
        ? await message.reply('Sua intenção é curiosa, mas não permito que remova a si mesmo ou a mim. Vamos focar os esforços onde realmente importa. ☕')
        : await chat.removeParticipants([`${extractTextFromBody(message.body)}@c.us`]);
    return canRemove;
}