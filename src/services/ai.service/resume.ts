import { resumeErrorMessages, resumePrompt } from "@/utils";
import { Client, Message } from "whatsapp-web.js";
import { openRouterProvider } from "./openRouterService";

export async function resumeMessages(client: Client, msg: Message) {
  const chat = await msg.getChat();

  await client
    .sendMessage(
      chat.id._serialized,
      "Certo. Vou buscar na minha memória as conversas recentes e estruturar um bom resumo para você. ✨",
    )
    .then(async (message) => message.react("⏳"));

  const getMessages = await chat.fetchMessages({ limit: 500 });
  const textMessages = getMessages
    .filter(
      (textMessage) =>
        !textMessage.hasMedia &&
        !textMessage.fromMe &&
        !textMessage.body.startsWith("/"),
    )
    .map((textMessage) => textMessage.body);
  console.log(textMessages.length);
  if (textMessages.length < 20) {
    await msg.react("✅");

    const randomMessage =
      resumeErrorMessages[
        Math.floor(Math.random() * resumeErrorMessages.length)
      ];

    await client
      .sendMessage(chat.id._serialized, randomMessage)
      .then(async (message) => await message.react("😥"));
    await msg.react("😥");
    return;
  }

  await msg.react("⌛");

  const prompt = resumePrompt(textMessages);

  try {
    const summary = await openRouterProvider.response(prompt, 0.7, 500);

    await msg.react("✅");
    await client.sendMessage(chat.id._serialized, summary);
  } catch (error) {
    console.error("Error while generating summary:", error);
    await msg.react("❌");
    await client.sendMessage(
      chat.id._serialized,
      "Peço desculpas, mas não consegui organizar o resumo neste momento. Talvez devamos tentar de novo. ☕",
    );
  }
}
