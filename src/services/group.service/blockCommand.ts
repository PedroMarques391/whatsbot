import { commandHandler } from "@/commands";
import { authorIsAdmin } from "@/helpers";
import GroupModel from "@/models/group";
import { extractTextFromBody } from "@/utils";
import { Chat, GroupChat, Message } from "whatsapp-web.js";

export async function blockCommand(message: Message, chat: Chat) {
  try {
    const chatId = chat.id._serialized;
    const isAdmin = await authorIsAdmin(chat as GroupChat, message);
    const commandToBlock = extractTextFromBody(message.body);
    const command = await commandHandler(commandToBlock);
    if (!isAdmin) return;

    if (!commandToBlock || !command) {
      const response = !commandToBlock
        ? "Será que vou precisar mandar um tutorial? \ntente: */block /nome_do_comando*"
        : `> O comando *${commandToBlock}* não existe. Não preciso me preocupar com ele, né?`;
      return await message.reply(response);
    }

    const updatedGroup = await GroupModel.findOneAndUpdate(
      { groupId: chatId },
      {
        $addToSet: { blockedCommands: command.name },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "before", includeResultMetadata: true },
    );

    if (
      !updatedGroup.lastErrorObject?.updatedExisting ||
      updatedGroup.value?.blockedCommands.includes(command.name)
    ) {
      const response = !updatedGroup.lastErrorObject?.updatedExisting
        ? "> Poxa, ainda não tenho esse grupo na minha base de dados."
        : `> O comando *${commandToBlock}* já estava bloqueado nesse grupo. Não se preocupe, ele já não pode mais ser usado por aqui.`;
      return await message.reply(response);
    }

    await message.reply(
      `> O comando *${commandToBlock}* foi bloqueado nesse grupo. Ninguém mais ousará usá-lo. `,
    );
    return;
  } catch (error: any) {
    await message.reply(error.message);
  }
}
