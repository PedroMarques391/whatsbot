import { Message } from "whatsapp-web.js";
import { BotError } from "@/errors/BotErrors";

export async function notAValidNumber(
  message: Message,
  command: string,
): Promise<boolean> {
  const mentions = await message.getMentions();

  if (mentions.length === 0) {
    throw BotError.validation(
      `Faltou o óbvio: marque o usuário com '@' logo após '${command}'.`,
    );
  }
  return false;
}
