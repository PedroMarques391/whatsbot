import { AIProvider } from "@/providers/ai.provider";
import { AIService } from "@/services/ai.service";
import { OpenRouter } from "@openrouter/sdk";

export class AIFactory {
  static getAiService(): AIService {
    const openRouter = new OpenRouter({
      apiKey: process.env.OPEN_ROUTER_API_KEY,
    });

    const provider = new AIProvider(openRouter);

    return new AIService(provider);
  }
}

export const getAIService = AIFactory.getAiService;
