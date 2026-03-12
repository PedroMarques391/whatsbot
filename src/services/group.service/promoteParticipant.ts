import {
  authorIsAdmin,
  botIsAdmin,
  getGroupAdmins,
  isNotInGroup,
  notAValidNumber,
} from "@/helpers";
import { extractTextFromBody } from "@/utils";
import { Client, GroupChat, Message } from "whatsapp-web.js";

export async function promoteParticipant(
  message: Message,
  chat: GroupChat,
  client: Client,
) {
  try {
    await Promise.all([
      botIsAdmin(chat),
      notAValidNumber(message, "/promote"),
      authorIsAdmin(chat, message),
      isNotInGroup(chat, message),
    ]);
    if (
      getGroupAdmins(chat).includes(`${extractTextFromBody(message.body)}@c.us`)
    ) {
      return message.reply(
        "Verifiquei, e este participante já ocupa um lugar na administração. Excelente escolha, por sinal. ☕",
      );
    }
    await chat.promoteParticipants([
      `${extractTextFromBody(message.body)}@c.us`,
    ]);
    await client.sendMessage(
      chat.id._serialized,
      `Temos um novo nome na liderança. @${extractTextFromBody(message.body)}, espero que conduza o grupo com a mesma elegância de sempre. ✨`,
      { mentions: [`${extractTextFromBody(message.body)}@c.us`] },
    );
  } catch (error: any) {
    return message.reply(error.message);
  }
}
