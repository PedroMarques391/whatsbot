import { openRouterChat } from "@/services";
import { Message } from "whatsapp-web.js";

/**
 * Handles user replies to messages previously sent by the bot.
 * If the user replies to a non-media message from the bot (not using a command),
 * this function will process the conversation and generate a response using Gemini.
 * @param message - The incoming message from the user.
 * @returns {boolean} A boolean indicating whether the interaction was handled.
 */
export async function quotedReply(message: Message): Promise<boolean> {
  const quotedMessage = await message.getQuotedMessage();

  if (
    message.fromMe ||
    !message.hasQuotedMsg ||
    message.body.trim().startsWith("/")
  )
    return false;

  if (quotedMessage.id.fromMe && !quotedMessage.hasMedia && !message.hasMedia) {
    try {
      const response = await openRouterChat(message.body, quotedMessage.body);
      await message.reply(response);
    } catch (error) {
      console.error("Erro ao processar resposta citada:", error);
      await message.reply(
        "Encontrei uma barreira técnica temporária e não consegui processar o contexto dessa resposta. Retorno em breve. 🌱",
      );
    }
    return true;
  }
  return false;
}
