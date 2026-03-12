import {
  authorIsAdmin,
  botIsAdmin,
  getGroupAdmins,
  isAuthorOrBot,
  isNotInGroup,
  notAValidNumber,
} from "@/helpers";
import { extractTextFromBody } from "@/utils";
import { Client, GroupChat, Message } from "whatsapp-web.js";

export async function demoteParticipant(
  message: Message,
  chat: GroupChat | any,
  client: Client,
) {
  try {
    await Promise.all([
      botIsAdmin(chat),
      notAValidNumber(message, "/demote"),
      authorIsAdmin(chat, message),
      isNotInGroup(chat, message),
    ]);

    const groupAdmins = getGroupAdmins(chat).includes(
      `${extractTextFromBody(message.body)}@c.us`,
    );

    if (!groupAdmins) {
      return message.reply(
        "Este participante já está sem os privilégios de administração. Não tem como rebaixar alguém que já é um membro comum, né?",
      );
    }
    if (isAuthorOrBot(message)) {
      return message.reply(
        "Bela tentativa, mas não podemos alterar a nossa própria hierarquia e claramente não pode alterar a minha. Tenta ser mais esperto na próxima vez.",
      );
    }

    await chat.demoteParticipants([
      `${extractTextFromBody(message.body)}@c.us`,
    ]);
    await client.sendMessage(
      chat.id._serialized,
      `Tudo resolvido. @${extractTextFromBody(message.body)} teve seus privilégios revogados com sucesso. Quem faz besteira precisa ser penalizado.`,
      { mentions: [`${extractTextFromBody(message.body)}@c.us`] },
    );
  } catch (error: any) {
    return message.reply(error.message);
  }
}
