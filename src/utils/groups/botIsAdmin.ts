import { GroupChat, Message } from "whatsapp-web.js";
import { CLIENT_NUMBER } from "../../config/env";
import { groups } from "./../";



/**
 * Checks whether the bot is an administrator in the specified group.
 * @param chat - The group chat where the check is being performed.
 * @param message - The message used to send a reply if the bot is not an admin.
 * @returns {boolean} A promise that resolves to true if the bot is an admin; otherwise, false.
 */

export async function botIsAdmin(chat: GroupChat, message: Message): Promise<boolean> {
    const admin = groups.getGroupAdmins(chat).includes(CLIENT_NUMBER);
    if (!admin) {
        await message.reply('Oops! Para eu conseguir ajudar, preciso ser um dos administradores do grupo. 🌟');
        return false;
    }
    return true;
}