import { GEMINI_API_KEY } from "@/config/env";
import { GoogleGenAI } from "@google/genai";
import { getSystemInstructions } from "./instructions";

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function geminiResponse(
  userMessage: string,
  temperature: number,
  maxOutputTokens: number,
): Promise<string> {
  try {
    const res = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: {
        role: "user",
        parts: [{ text: userMessage }],
      },
      config: {
        systemInstruction: {
          role: "system",
          parts: getSystemInstructions(),
        },
        maxOutputTokens,
        temperature,
        topK: 2,
      },
    });

    if (!res.text) {
      throw new Error("Resposta vazia da API Gemini");
    }

    return res.text;
  } catch (error: any) {
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      console.error("⚠️ Limite de requisições da API Gemini excedido");
      return "Desculpe, estou com muitas requisições no momento. Por favor, tente novamente em alguns segundos! 🙏";
    }

    console.error("Erro ao gerar resposta do Gemini:", error.message || error);
    throw error;
  }
}

export async function geminiChat(
  userMessage: string,
  botResponse: string,
): Promise<string> {
  try {
    const chat = genAI.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [{ text: "O usuário vai responder uma mensagem sua" }],
        },
        {
          role: "model",
          parts: [{ text: botResponse }],
        },
      ],
      config: {
        systemInstruction: {
          role: "system",
          parts: getSystemInstructions(),
        },
        maxOutputTokens: 300,
        temperature: 1.0,
        topK: 2,
      },
    });

    const response = await chat.sendMessage({ message: userMessage });

    if (!response.text) {
      throw new Error("Resposta vazia da API Gemini");
    }

    return response.text;
  } catch (error: any) {
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      console.error("⚠️ Limite de requisições da API Gemini excedido");
      return "Desculpe, estou com muitas requisições no momento. Por favor, tente novamente em alguns segundos! 🙏";
    }

    console.error(
      "Erro ao gerar resposta do Gemini (chat):",
      error.message || error,
    );
    throw error;
  }
}
