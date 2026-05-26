import { authorIsAdmin } from "@/helpers";
import GroupModel from "@/models/group";
import { extractTextFromBody } from "@/utils";
import { GroupChat, Message } from "whatsapp-web.js";
import { BotError } from "@/errors/BotErrors";

export async function setExitMessage(chat: GroupChat, message: Message) {
  const idAdmin = await authorIsAdmin(chat as GroupChat, message);
  const exitMessage = extractTextFromBody(message.body);
  if (!idAdmin) return;

  const updateGroup = await GroupModel.findOneAndUpdate(
    { groupId: chat.id._serialized },
    { $set: { leftMessage: exitMessage } },
    { lean: true },
  );
  if (!updateGroup) {
    throw BotError.validation(
      "Não foi possível definir a mensagem de saída, parece que o grupo não está cadastrado.",
    );
  }

  const messageReply = exitMessage
    ? "Mensagem de saída atualizada com sucesso!"
    : "Mensagem de saída removida com sucesso!";

  await message.reply(messageReply);
}
