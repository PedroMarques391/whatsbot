import { Chat, Message } from "whatsapp-web.js";
import { ICommand } from "../../../types";
import GroupModel from "../../models/group";

export async function validateBlockedCommand(
  command: ICommand,
  chat: Chat,
  message: Message,
): Promise<boolean> {
  if (!chat.isGroup) return false;

  const group = await GroupModel.findOne({ groupId: chat.id._serialized });
  console.log(command);

  if (!group) return false;

  if (group.blockedCommands.includes(command.name)) {
    await message.reply(
      `Desculpe, o comando *${command.name}* (e seus atalhos) está bloqueado neste grupo. Peça para um administrador desbloquear.`,
    );
    return true;
  }

  return false;
}
