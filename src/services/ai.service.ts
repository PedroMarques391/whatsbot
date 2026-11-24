import { BotError } from "@/errors/BotErrors";
import { AIProvider } from "@/providers/ai.provider";
import { MessageUtils, StringUtils } from "@/utils";
import { Client, Message } from "whatsapp-web.js";

export class AIService {
  constructor(public readonly provider: AIProvider) {}

  async response(
    message: Message,
    temperature: number,
    maxOutputTokens: number,
  ): Promise<void> {
    if (message.fromMe) return;
    try {
      const question = StringUtils.extractTextFromBody(message.body);

      const text = await this.provider.response(
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
        "Ou a pergunta foi irrelevante demais, ou a API caiu. De qualquer forma, não vou responder agora.",
      );
    }
  }

  async resumeMessages(client: Client, msg: Message): Promise<void> {
    const chat = await msg.getChat();

    await client
      .sendMessage(
        chat.id._serialized,
        "Certo. Vou buscar na minha memória as conversas recentes e estruturar um bom resumo para você. ✨",
      )
      .then(async (message) => message.react("⏳"));

    const getMessages = await chat.fetchMessages({ limit: 500 });
    const textMessages = getMessages
      .filter(
        (textMessage) =>
          !textMessage.hasMedia &&
          !textMessage.fromMe &&
          !textMessage.body.startsWith("/"),
      )
      .map((textMessage) => textMessage.body);

    console.log(textMessages.length);
    if (textMessages.length < 20) {
      await msg.react("✅");

      const randomMessage = MessageUtils.errorMessages("resume");

      await client
        .sendMessage(chat.id._serialized, randomMessage)
        .then(async (message) => await message.react("🙄"));
      await msg.react("❌");
      return;
    }

    await msg.react("⌛");

    const prompt = MessageUtils.promptsAI(textMessages);

    try {
      const summary = await this.provider.response(prompt, 0.7, 500);

      await msg.react("✅");
      await client.sendMessage(chat.id._serialized, summary);
    } catch (error) {
      console.error("Error while generating summary:", error);
      await msg.react("❌");
      await client.sendMessage(
        chat.id._serialized,
        "Não consegui gerar esse resumo agora. Talvez nem valesse a pena ler mesmo. ☕",
      );
    }
  }

  async chat(userMessage: string, botResponse: string): Promise<string | undefined> {
    return this.provider.chat(userMessage, botResponse);
  }
}
