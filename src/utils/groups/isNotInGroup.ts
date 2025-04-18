import { GroupChat, Message } from "whatsapp-web.js";
import { extractTextFromBody, groupParticipants } from "../helpers";


/**
 * Determines whether a user is not part of the group participants list.
 * @param chat - The group chat to check.
 * @param message - The message containing the user information.
 * @returns {boolean} True if the user is not in the group; otherwise, false.
 */
export async function isNotInGroup(chat: GroupChat, message: Message): Promise<boolean> {
    if (!groupParticipants(chat).includes(`${extractTextFromBody(message.body)}@c.us`)) {
        await message.reply(`O número "${extractTextFromBody(message.body)}" não está presente no grupo.`);
        return true;
    }
    return false;
}