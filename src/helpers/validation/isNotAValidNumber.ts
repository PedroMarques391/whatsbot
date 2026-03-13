import { extractTextFromBody } from "@/utils";
import { Message } from "whatsapp-web.js";

export async function notAValidNumber(
  message: Message,
  command: string,
): Promise<boolean> {
  if (
    extractTextFromBody(message.body) === "" ||
    extractTextFromBody(message.body).match(/[+\-()]/)
  ) {
    throw new Error(
      `Faltou um pequeno detalhe. Indique o usuário usando '@' logo após o comando '${command}'. ☕`,
    );
  }
  return false;
}
