import { tool, type Tool } from "@openrouter/agent";
import { z } from "zod/v4";

export class ToolsHelper {
  static createSticker(): Tool {
    return tool({
      name: "createSticker",
      description:
        "Cria e envia uma figurinha (sticker) no chat atual do WhatsApp usando a imagem, vídeo ou figurinha anexada ou respondida na mensagem.",
      inputSchema: z.object({
        withAudio: z
          .boolean()
          .default(false)
          .describe(
            "True se o usuário pedir figurinha com áudio/som ou pedir para incluir o som do vídeo/áudio; false caso contrário.",
          ),
      }),
      execute: false,
    });
  }
}
