import {
  authorIsAdmin,
  botIsAdmin,
  getGroupAdmins,
  isAuthorOrBot,
  isUserNotInGroup,
  notAValidNumber,
} from "@/helpers";
import { serializeMention } from "@/utils";
import { Client, GroupChat, Message } from "whatsapp-web.js";

export async function demoteParticipant(
  message: Message,
  chat: GroupChat | any,
  client: Client,
) {
  try {
    await Promise.all([
      botIsAdmin(chat),
      notAValidNumber(message, "/downgrade"),
      authorIsAdmin(chat, message),
      isUserNotInGroup(chat, message),
    ]);

    const { serializedNumber, user } = await serializeMention(message);

    const groupAdmins = getGroupAdmins(chat).includes(serializedNumber);

    if (!groupAdmins) {
      return message.reply(
        "Este participante já está sem os privilégios de administração. Não tem como rebaixar alguém que já é um membro comum, né?",
      );
    }
    if (isAuthorOrBot(message)) {
      return message.reply(
        "Bela tentativa, mas não podemos alterar a sua própria hierarquia e claramente não pode alterar a minha. Tenta ser mais esperto na próxima vez.",
      );
    }

    await chat.demoteParticipants([serializedNumber]);
    await client.sendMessage(
      chat.id._serialized,
      `Tudo resolvido. @${user} teve seus privilégios revogados com sucesso. Quem faz besteira precisa ser penalizado.`,
      { mentions: [serializedNumber] },
    );
  } catch (error: any) {
    return message.reply(error.message);
  }
}
