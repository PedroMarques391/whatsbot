import { GroupChat, Message } from 'whatsapp-web.js';
import { CLIENT_NUMBER } from '../../config/env';
import { getGroupAdmins } from '../group/groupAdmins';



/**
 * Checks whether the bot is an administrator in the specified group.
 * @param chat - The group chat where the check is being performed.
 * @returns {boolean} A promise that resolves to true if the bot is an admin.
 * @throws {Error} If the bot is not an admin.
 */

export async function botIsAdmin(chat: GroupChat): Promise<boolean> {
    const admin = getGroupAdmins(chat).includes(CLIENT_NUMBER);
    if (!admin) {
        throw new Error('Adoraria te ajudar com isso, mas preciso ser nomeada administradora do grupo antes. ✨');
    }
    return true;
}