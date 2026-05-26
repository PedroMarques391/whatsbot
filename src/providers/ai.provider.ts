import { BotError } from "@/errors/BotErrors";
import { OpenRouter } from "@openrouter/sdk";
import adaPersonality from "./../../identity/PERSONALITY.json";

export class AIProvider {
  private client: OpenRouter;
  private readonly systemPrompt: string;
  private readonly model = "openai/gpt-oss-120b";
  constructor(client: OpenRouter) {
    this.client = client;
    this.systemPrompt = JSON.stringify(adaPersonality);
  }

  async response(
    userMessage: string,
    temperature: number,
    maxOutputTokens: number,
  ) {
    try {
      const completion = await this.client.chat.send({
        chatGenerationParams: {
          model: this.model,
          messages: [
            { role: "system", content: this.systemPrompt },
            { role: "user", content: userMessage },
          ],
          stream: false,
          temperature: temperature,
          maxTokens: maxOutputTokens,
        },
      });

      if (!completion?.choices?.[0]?.message?.content) {
        throw BotError.externalApi(
          "Resposta vazia da API OpenRouter",
          new Error("OpenRouter return empty choices or content"),
        );
      }

      return completion.choices[0].message.content;
    } catch (error: any) {
      this.errorHandler(error);
    }
  }

  async chat(userMessage: string, botResponse: string): Promise<string> {
    try {
      const completion = await this.client.chat.send({
        chatGenerationParams: {
          model: this.model,
          messages: [
            { role: "system", content: this.systemPrompt },
            { role: "assistant", content: botResponse },
            { role: "user", content: userMessage },
          ],
          stream: false,
          temperature: 0.7,
          maxTokens: 300,
        },
      });

      if (!completion?.choices?.[0]?.message?.content) {
        throw BotError.externalApi(
          "Resposta vazia da API OpenRouter",
          new Error("OpenRouter return empty choices or content"),
        );
      }
      return completion.choices[0].message.content;
    } catch (error: any) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: Error): never {
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      console.error("Limite de requisições da API OpenRouter excedido");
      throw BotError.externalApi(
        "Limite de requisições da API OpenRouter excedido",
        error,
        "Estou analisando muitas coisas ao mesmo tempo. Pode me chamar de novo em alguns instantes? 🌱",
      );
    }
    throw BotError.externalApi(
      "Ocorreu um erro ao processar sua solicitação na API OpenRouter",
      error,
      "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde. 🌱",
    );
  }
}
