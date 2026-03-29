import { authorIsAdmin } from "@/helpers";
import GroupModel from "@/models/group";
import { extractTextFromBody } from "@/utils";
import { GroupChat, Message } from "whatsapp-web.js";

export async function setWelcomeMessage(chat: GroupChat, message: Message) {
  try {
    const idAdmin = await authorIsAdmin(chat as GroupChat, message);
    const welcomeMessage = extractTextFromBody(message.body);
    if (!idAdmin) return;

    const updateGroup = await GroupModel.findOneAndUpdate(
      { groupId: chat.id._serialized },
      { $set: { welcomeMessage: welcomeMessage } },
      { lean: true },
    );

    if (!updateGroup) {
      await message.reply(
        "Não foi possível definir a mensagem de boas-vindas, parece que o grupo não está cadastrado.",
      );
      return;
    }

    const messageReply = welcomeMessage
      ? "Mensagem de boas-vindas atualizada com sucesso!"
      : "Mensagem de boas-vindas removida com sucesso!";

    await message.reply(messageReply);
  } catch (error) {
    await message.reply(
      error instanceof Error
        ? error.message
        : "Ocorreu um erro ao definir a mensagem de boas-vindas.",
    );
  }
}
