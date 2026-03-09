import { GroupChat, Message } from 'whatsapp-web.js';
import { getGroupAdmins } from '../group/groupAdmins';

/**
 * Checks whether the author of the message is an administrator in the group.
 * @param chat - The group chat where the message was sent.
 * @param message - The message whose author will be checked.
 * @returns {boolean} A promise that resolves to true if the author is an admin; otherwise, false.
 */
export async function authorIsAdmin(chat: GroupChat, message: Message): Promise<boolean> {
    if (!message.author || !getGroupAdmins(chat).includes(message.author)) {
        await message.reply('Sinto muito, mas essa ação requer privilégios de administração. Se desejar, fale com quem está no comando. ☕');
        return false;
    }
    return true;
}