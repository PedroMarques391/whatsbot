import { AIProvider } from "@/providers/ai.provider";
import { OpenRouter } from "@openrouter/sdk";

const openRouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

const openRouterProvider = new AIProvider(openRouter);

export { openRouterProvider };
