import { Message } from "whatsapp-web.js";
import { BotError } from "@/errors/BotErrors";

export async function notAValidNumber(
  message: Message,
  command: string,
): Promise<boolean> {
  const mentions = await message.getMentions();

  if (mentions.length === 0) {
    throw BotError.validation(
      `Faltou um pequeno detalhe. Indique o usuário usando '@' logo após o comando '${command}'. ☕`,
    );
  }
  return false;
}
