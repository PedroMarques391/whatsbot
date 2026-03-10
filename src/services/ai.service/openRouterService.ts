import { OpenRouter } from '@openrouter/sdk';
import { getSystemInstructions } from './instructions';

const openRouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
  
});


const systemPrompt = getSystemInstructions().map(inst => inst.text).join(' ');

export async function openRouterResponse(
  userMessage: string,
  temperature: number,
  maxOutputTokens: number,
): Promise<string> {
  try {
    const completion = await openRouter.chat.send({
      chatGenerationParams: {
        model: 'openai/gpt-4o-mini', 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        stream: false,
        temperature: temperature,
        maxTokens: maxOutputTokens,
      }
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Resposta vazia da API OpenRouter");
    }

    return completion.choices[0].message.content;
  } catch (error: any) {
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      console.error("Limite de requisições da API OpenRouter excedido");
      return "Estou analisando muitas coisas ao mesmo tempo. Pode me chamar de novo em alguns instantes? 🌱";
    }

    console.error("Erro ao gerar resposta do OpenRouter:", error.message || error); 
    throw error;
  }
} 

export async function openRouterChat( 
  userMessage: string,
  botResponse: string,
): Promise<string> {
  try {
    const completion = await openRouter.chat.send({
      chatGenerationParams: {
        model: 'openai/gpt-4o-mini', 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: "O usuário vai responder uma mensagem sua:" },
          { role: 'assistant', content: botResponse },
          { role: 'user', content: userMessage },
        ],
        stream: false,
        temperature: 1.0,
      }
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Resposta vazia da API OpenRouter");
    }

    return completion.choices[0].message.content;
  } catch (error: any) {
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      console.error("⚠️ Limite de requisições da API OpenRouter excedido");
      return "Estou analisando muitas coisas ao mesmo tempo. Pode me chamar de novo em alguns instantes? 🌱";
    }

    console.error("Erro ao gerar resposta do OpenRouter (chat):", error.message || error);
    throw error;
  }
}
