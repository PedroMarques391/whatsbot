import { Message } from "whatsapp-web.js";

export async function validateCommand(message: Message): Promise<boolean> {
  if (message.body.trim().startsWith("/")) {
    await message.reply(
      `O comando \`${message.body.split(" ")[0]}\` não existe. Inventar sintaxe não faz funcionar.\n` +
        "Use */start* antes de tentar de novo.",
    );
    return true;
  }
  return false;
}
