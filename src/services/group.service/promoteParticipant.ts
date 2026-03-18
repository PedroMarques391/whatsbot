import {
  authorIsAdmin,
  botIsAdmin,
  getGroupAdmins,
  isUserNotInGroup,
  notAValidNumber,
} from "@/helpers";
import { serializeMention } from "@/utils";
import { Client, GroupChat, Message } from "whatsapp-web.js";

export async function promoteParticipant(
  message: Message,
  chat: GroupChat,
  client: Client,
) {
  try {
    await Promise.all([
      botIsAdmin(chat),
      notAValidNumber(message, "/upgrade"),
      authorIsAdmin(chat, message),
      isUserNotInGroup(chat, message),
    ]);

    const { serializedNumber, user } = await serializeMention(message);

    if (getGroupAdmins(chat).includes(serializedNumber)) {
      return message.reply(
        "Verifiquei, e este participante já ocupa um lugar na administração. Excelente escolha, por sinal. ☕",
      );
    }

    await chat.promoteParticipants([serializedNumber]);

    await client.sendMessage(
      chat.id._serialized,
      `Temos um novo nome na liderança. @${user}, espero que conduza o grupo com a mesma elegância de sempre. ✨`,
      { mentions: [serializedNumber] },
    );
  } catch (error: any) {
    console.error(error);
    return message.reply(error.message);
  }
}
