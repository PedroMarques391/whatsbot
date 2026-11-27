import { BotError } from "@/errors/BotErrors";
import { StickerFactory } from "@/factories/getStickerService";
import { ToolsHelper } from "@/helpers/tools/tools.helper";
import { AIProvider } from "@/providers/ai.provider";
import { MessageUtils, StringUtils } from "@/utils";
import { Chat, Client, Message } from "whatsapp-web.js";

export class AIService {
  constructor(public readonly provider: AIProvider) {}

  async response(
    client: Client,
    message: Message,
    temperature: number,
    maxOutputTokens: number,
    chat?: Chat,
  ): Promise<void> {
    if (message.fromMe) return;
    try {
      const userMessage = StringUtils.extractTextFromBody(message.body);
      const currentChat = chat ?? (await message.getChat());

      const stickerTool = ToolsHelper.createSticker();

      const { text, toolCalls } = await this.provider.callModel(
        userMessage,
        [stickerTool],
        {
          temperature,
          maxOutputTokens,
        },
      );

      const stickerCall = toolCalls.find(
        (call) => call.name === "createSticker",
      );
      if (stickerCall) {
        const withAudio = Boolean(stickerCall.arguments?.withAudio);
        const stickerService = StickerFactory.getStickerService(
          client,
          message,
        );
        await stickerService.makeSticker(
          currentChat.id._serialized,
          withAudio,
        );
        return;
      }

      await message.react("✅");

      if (text.trim()) {
        await message.reply(text);
      }
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

  async chat(
    userMessage: string,
    botResponse: string,
  ): Promise<string | undefined> {
    return this.provider.chat(userMessage, botResponse);
  }
}
