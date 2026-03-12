import {
  authorIsAdmin,
  botIsAdmin,
  groupParticipants,
  notAValidNumber,
} from "@/helpers";
import { extractTextFromBody } from "@/utils";
import { GroupChat, Message } from "whatsapp-web.js";

export async function addParticipant(message: Message, chat: GroupChat) {
  try {
    await Promise.all([
      botIsAdmin(chat),
      notAValidNumber(message, "/add"),
      authorIsAdmin(chat, message),
    ]);
    const phoneRegex = /^\d{12,}$/;
    if (!phoneRegex.test(extractTextFromBody(message.body))) {
      return message.reply(
        "O número que você me enviou parece ter algum detalhe incorreto. Tente adicionar *55* e remover o digito *9* se tiver.",
      );
    }
    if (
      groupParticipants(chat).includes(
        `${extractTextFromBody(message.body)}@c.us`,
      )
    ) {
      return message.reply(
        `Noto que esta pessoa já faz parte do nosso grupo. Não precisamos de convites duplicados, certo? ✨`,
      );
    }
    await chat.addParticipants([`${extractTextFromBody(message.body)}@c.us`]);
    return;
  } catch (error: any) {
    await message.reply(error.message);
    return;
  }
}
