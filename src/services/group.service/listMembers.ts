import { authorIsAdmin } from "@/helpers";
import { GroupChat, Message } from "whatsapp-web.js";

export async function listMembers(chat: GroupChat, message: Message) {
  const userIsAdmin = await authorIsAdmin(chat, message);

  if (userIsAdmin) {
    let text = `Atenção membros do ${chat.name}!\n`;
    const mentions = [];

    for (const participant of chat.participants) {
      mentions.push(`${participant.id.user}@c.us`);
      text += `@${participant.id.user} `;
    }
    await chat.sendMessage(text, { mentions });
  }
}
