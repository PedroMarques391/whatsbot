import { commandHandler } from "@/commands";
import { authorIsAdmin } from "@/helpers";
import GroupModel from "@/models/group";
import { extractTextFromBody } from "@/utils";
import { Chat, GroupChat, Message } from "whatsapp-web.js";

export async function unblockCommand(message: Message, chat: Chat) {
  try {
    const chatId = chat.id._serialized;
    const isAdmin = await authorIsAdmin(chat as GroupChat, message);
    const commandToUnblock = extractTextFromBody(message.body);
    const command = await commandHandler(commandToUnblock);

    if (!isAdmin) return;

    if (!commandToUnblock || !command) {
      const response = !commandToUnblock
        ? "Será que vou precisar mandar um tutorial? \ntente: */unblock /nome_do_comando*"
        : `> O comando *${commandToUnblock}* não existe. Não preciso me preocupar com ele, né?`;

      return await message.reply(response);
    }

    const updatedGroup = await GroupModel.findOneAndUpdate(
      { groupId: chatId },
      {
        $pull: { blockedCommands: command.name },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "before", includeResultMetadata: true },
    );

    if (
      !updatedGroup.lastErrorObject?.updatedExisting ||
      !updatedGroup.value?.blockedCommands.includes(command.name)
    ) {
      const response = !updatedGroup.lastErrorObject?.updatedExisting
        ? "> Poxa, ainda não tenho esse grupo na minha base de dados."
        : `> O comando *${command.name}* não está bloqueado neste grupo, fica calmo(a).`;
      return await message.reply(response);
    }

    await message.reply(
      `> O comando *${command.name}* foi desbloqueado, podem usar a vontade!`,
    );
  } catch (error: any) {
    await message.reply(error.message);
  }
}
