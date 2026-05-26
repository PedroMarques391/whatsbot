import { extractTextFromBody } from "@/utils";
import { Message } from "whatsapp-web.js";
import { openRouterProvider } from "./openRouterService";
import { BotError } from "@/errors/BotErrors";

export async function response(
  message: Message,
  temperature: number,
  maxOutputTokens: number,
) {
  if (message.fromMe) return;
  try {
    const question = extractTextFromBody(message.body);

    const text = await openRouterProvider.response(
      `responda: ${question}`,
      temperature,
      maxOutputTokens,
    );

    await message.react("✅");

    await message.reply(text);
  } catch (error: any) {
    throw BotError.externalApi(
      "An error occurred while processing the response",
      error,
      "Desculpe, não sei como responder isso. 😫😫"
    );
  }
}
