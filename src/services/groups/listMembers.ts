import { GroupChat } from "whatsapp-web.js";

export async function listMembers(chat: GroupChat | any) {
    let text = `Atenção membros do ${chat.name}!\n`;
    const mentions = [];

    for (const participant of chat.participants) {
        mentions.push(`${participant.id.user}@c.us`);
        text += `@${participant.id.user} `;
    }
    await chat.sendMessage(text, { mentions });
}