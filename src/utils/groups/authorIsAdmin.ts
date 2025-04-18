import { GroupChat, Message } from "whatsapp-web.js";
import { groups } from "..";

/**
 * Checks whether the author of the message is an administrator in the group.
 * @param chat - The group chat where the message was sent.
 * @param message - The message whose author will be checked.
 * @returns {boolean} A promise that resolves to true if the author is an admin; otherwise, false.
 */
export async function authorIsAdmin(chat: GroupChat, message: Message): Promise<boolean> {
    if (!message.author || !groups.getGroupAdmins(chat).includes(message.author)) {
        await message.reply('Poxa 🙁, você precisa ser um administrador para executar esse comando.');
        return false;
    }
    return true;
}