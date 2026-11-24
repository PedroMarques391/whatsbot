import { commandHandler } from "@/commands";
import { StringUtils } from "@/utils";
import { Message } from "whatsapp-web.js";
import { BotError } from "@/errors/BotErrors";

export async function help(message: Message) {
  const commandToGetHelp = StringUtils.extractTextFromBody(message.body);
  const command = await commandHandler(commandToGetHelp);

  if (!commandToGetHelp || !command) {
    const response = !commandToGetHelp
      ? `> Sintaxe básica: \`/help <comando>\`. Não é tão difícil.`
      : `> O comando *${commandToGetHelp}* não existe. Não vou perder tempo procurando algo que você inventou.`;

    throw BotError.validation(response);
  }

  const { aliases, description, sintaxe } = command;

  let replyMsg = `*『 ${command.name} 』*\n`;
  replyMsg += `_${description}_\n`;
  if (aliases && aliases.length > 0) {
    replyMsg += `*Atalhos:* ${aliases.map((a) => "`" + a + "`").join(", ")}\n`;
  }
  if (sintaxe) {
    replyMsg += `*Sintaxe:*\u0060\u0060\u0060${sintaxe}\u0060\u0060\u0060`;
  }
  await message.reply(replyMsg);
  return;
}
