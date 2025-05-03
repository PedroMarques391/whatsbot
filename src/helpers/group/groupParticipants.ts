import { GroupChat } from 'whatsapp-web.js';

export function groupParticipants(chat: GroupChat): string[] {
    const participants = [];
    for (const participant of chat.participants) {
        participants.push(`${participant.id.user}@c.us`);
    }
    return participants;
}