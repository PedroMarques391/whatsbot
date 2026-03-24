import { commandHandler } from "@/commands";
import { authorIsAdmin } from "@/helpers";
import GroupModel from "@/models/group";
import { extractTextFromBody } from "@/utils";
import { Chat, GroupChat, Message } from "whatsapp-web.js";

export async function blockCommand(message: Message, chat: Chat) {
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
      $addToSet: { blockedCommands: commandToBlock },
      $set: { updatedAt: new Date() },
    },
    { returnDocument: "after" },
  );

  if (!updatedGroup) {
    return await message.reply(
      "> Poxa, ainda não tenho esse grupo na minha base de dados.",
    );
  }

  await message.reply(
    `> O comando *${commandToBlock}* foi bloqueado nesse grupo. Ninguém mais ousará usá-lo.`,
  );
  return;
}
