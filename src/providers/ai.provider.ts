import { OpenRouter } from "@openrouter/sdk";
import adaPersonality from "./../../identity/PERSONALITY.json";

export class AIProvider {
  private client: OpenRouter;
  private readonly systemPrompt: string;
  private readonly model = "openai/gpt-4o-mini";
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
        throw new Error("Resposta vazia da API OpenRouter");
      }

      return completion.choices[0].message.content;
    } catch (error: any) {
      const errorMessage = this.errorHandler(error);
      throw errorMessage;
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
        throw new Error("Resposta vazia da API OpenRouter");
      }
      return completion.choices[0].message.content;
    } catch (error: any) {
      const errorMessage = this.errorHandler(error);
      throw errorMessage;
    }
  }

  private errorHandler(error: Error) {
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      console.error("Limite de requisições da API OpenRouter excedido");
      return "Estou analisando muitas coisas ao mesmo tempo. Pode me chamar de novo em alguns instantes? 🌱";
    }
    return "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde. 🌱";
  }
}
