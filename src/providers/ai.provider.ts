import { BotError } from "@/errors/BotErrors";
import {
  callModel,
  stepCountIs,
  type CallModelInput,
  type Tool,
} from "@openrouter/agent";
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
  ): Promise<string> {
    try {
      const completion = await this.client.chat.send({
        chatRequest: {
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

      const content = this.extractContentText(
        completion?.choices?.[0]?.message?.content,
      );
      if (!content) {
        throw BotError.externalApi(
          "Resposta vazia da API OpenRouter",
          new Error("OpenRouter return empty choices or content"),
        );
      }

      return content;
    } catch (error: any) {
      this.errorHandler(error);
    }
  }

  async chat(userMessage: string, botResponse: string): Promise<string> {
    try {
      const completion = await this.client.chat.send({
        chatRequest: {
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

      const content = this.extractContentText(
        completion?.choices?.[0]?.message?.content,
      );
      if (!content) {
        throw BotError.externalApi(
          "Resposta vazia da API OpenRouter",
          new Error("OpenRouter return empty choices or content"),
        );
      }
      return content;
    } catch (error: any) {
      this.errorHandler(error);
    }
  }

  private extractContentText(
    content:
      | string
      | Array<{ type?: string; text?: string }>
      | null
      | undefined,
  ): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((item) => (item.type === "text" && item.text ? item.text : ""))
        .join("");
    }
    return "";
  }

  async callModel(
    input: CallModelInput["input"],
    tools: readonly Tool[] = [],
    options?: {
      instructions?: string;
      model?: string;
      temperature?: number;
      maxOutputTokens?: number;
      maxSteps?: number;
    },
  ): Promise<{
    text: string;
    toolCalls: Array<{ name: string; arguments: Record<string, unknown> }>;
  }> {
    try {
      const result = callModel(this.client, {
        model: options?.model ?? this.model,
        instructions: options?.instructions ?? this.systemPrompt,
        input,
        tools,
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxOutputTokens ?? 300,
        stopWhen: stepCountIs(options?.maxSteps ?? 5),
      });

      const text = await result.getText();
      const toolCalls = await result.getToolCalls();

      return {
        text,
        toolCalls: toolCalls.map((call) => ({
          name: call.name,
          arguments: (call.arguments ?? {}) as Record<string, unknown>,
        })),
      };
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
        "Excederam o limite de requisições. Esperem um pouco antes de exigir minha atenção de novo. ☕",
      );
    }
    throw BotError.externalApi(
      "Ocorreu um erro ao processar sua solicitação na API OpenRouter",
      error,
      "A requisição falhou. Tente de novo mais tarde, se ainda fizer diferença.",
    );
  }
}
