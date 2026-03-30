import { delay, extractTextFromBody } from "@/utils";
import path from "path";
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import { openRouterProvider } from "../ai.service/openRouterService";

export const sendUpdateMessages = async (client: Client, message: Message) => {
  const body: string = extractTextFromBody(message.body);
  const chats = await client.getChats();
  const groups = chats
    .filter((chat) => chat.isGroup)
    .map((chat) => chat.id._serialized);

  if (!body) {
    await client.sendMessage(
      process.env.CLIENT_NUMBER,
      "Percebo que a instrução de atualização está vazia. Por favor, forneça o texto para que eu possa conduzir os anúncios. ☕",
    );
    return;
  }

  const instruction: string =
    "Create a sophisticated, polite, and mature update message tailored for group announcements in Portuguese. Ensure it sounds knowledgeable, elegant, and uses minimal emojis like a brilliant female assistant named Ada.";

  const text: string = await openRouterProvider.response(
    `${instruction}: ${body}`,
    0.7,
    200,
  );

  const media = MessageMedia.fromFilePath(
    path.resolve(process.cwd(), "src/assets/images/adaUpdate.jpg"),
  );
  for (const group of groups) {
    await client.sendMessage(group, media, { caption: text });
    await delay(2000);
  }
};
