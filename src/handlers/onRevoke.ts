import RevokedMessageModel from "@/models/revokeMessages";
import { Message } from "whatsapp-web.js";

export async function onRevoke(
  message: Message,
  messageRevoke: Message | null | undefined,
) {
  const contact = await message.getContact();
  const chat = await message.getChat();

  if (!messageRevoke || !messageRevoke.body) return;

  const revokedMessage = await RevokedMessageModel.create({
    groupId: chat.id._serialized,
    userId: contact.id._serialized,
    userLid: chat.lastMessage.author,
    userName: contact.pushname || "Desconhecido",
    message: messageRevoke.body,
    sendAt: message.timestamp,
  });

  console.log(
    `[onMessageRevoke] Message revoked on group ${revokedMessage.groupId} by ${revokedMessage.userName} @lid ${revokedMessage.userLid}`,
  );
}
