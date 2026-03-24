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

  if (!group) return false;

  const isBlocked =
    group.blockedCommands.includes(command.name) ||
    (command.aliases &&
      command.aliases.some((alias) => group.blockedCommands.includes(alias)));

  if (isBlocked) {
    await message.reply(
      `Desculpe, o comando *${command.name}* (ou seu atalho) está bloqueado neste grupo. Peça para um administrador desbloquear.`,
    );
    return true;
  }

  return false;
}
