import { GroupChat } from 'whatsapp-web.js';

/**
 * Returns a list of all administrator user IDs in the specified group chat.
 * @param chat - The group chat from which to extract admin participants.
 * @returns {string[]} An array of admin WhatsApp IDs in the format 'number@c.us'.
 */
export function getGroupAdmins(chat: GroupChat): string[] {
    const adms = [];
    for (const participant of chat.participants) {
        if (participant.isAdmin) {
            adms.push(`${participant.id.user}@c.us`);
        }
    }
    return adms;
}