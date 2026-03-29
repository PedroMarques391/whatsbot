import { commandHandler } from "@/commands";
import { extractTextFromBody } from "@/utils";
import { Message } from "whatsapp-web.js";

export async function help(message: Message) {
  const commandToGetHelp = extractTextFromBody(message.body);
  const command = await commandHandler(commandToGetHelp);

  if (!commandToGetHelp || !command) {
    const response = !commandToGetHelp
      ? `> Mostra o jeito correto de usar os comandos, use a sintaxe correta: \`/help <comando>\`.`
      : `> O comando *${commandToGetHelp}* não existe. Não preciso me preocupar com ele, né?`;

    await message.reply(response);
    return;
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
