import { authorIsAdmin } from "@/helpers";
import GroupModel from "@/models/group";
import { extractTextFromBody } from "@/utils";
import { GroupChat, Message } from "whatsapp-web.js";
import { BotError } from "@/errors/BotErrors";

export async function setWelcomeMessage(chat: GroupChat, message: Message) {
  const idAdmin = await authorIsAdmin(chat as GroupChat, message);
  const welcomeMessage = extractTextFromBody(message.body);
  if (!idAdmin) return;

  const updateGroup = await GroupModel.findOneAndUpdate(
    { groupId: chat.id._serialized },
    { $set: { welcomeMessage: welcomeMessage } },
    { lean: true },
  );

  if (!updateGroup) {
    throw BotError.validation(
      "Não foi possível definir a mensagem de boas-vindas, parece que o grupo não está cadastrado.",
    );
  }

  const messageReply = welcomeMessage
    ? "Mensagem de boas-vindas atualizada com sucesso!"
    : "Mensagem de boas-vindas removida com sucesso!";

  await message.reply(messageReply);
}
