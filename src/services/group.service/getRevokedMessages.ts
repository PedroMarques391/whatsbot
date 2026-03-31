import RevokedMessageModel from "@/models/revokeMessages";
import { formatDate } from "@/utils";
import { Chat, Client, Message } from "whatsapp-web.js";

export async function getRevokedMessages(
  message: Message,
  chat: Chat,
  client: Client,
) {
  interface IRevokedMessage {
    userName: string;
    message: string;
    revokedAt: Date;
  }

  const mentioned = message.mentionedIds[0];
  const { id, pushname } = await client.getContactById(
    mentioned || message.author || message.from,
  );
  const chatId = chat.id._serialized;
  const revogedMessages: IRevokedMessage[] = await RevokedMessageModel.find(
    {
      groupId: chatId,
      $or: [{ userId: id._serialized }, { userLid: mentioned }],
    },
    {
      userName: 1,
      message: 1,
      sendAt: 1,
      revokedAt: 1,
      _id: 0,
    },
    { sort: { createdAt: -1 }, limit: 10 },
  );
  if (revogedMessages.length === 0) {
    await message.reply(
      `> ${pushname} não apagou nenhuma mensagem neste grupo, mas vou ficar de olho. 👀`,
    );
    return;
  }

  let header = `> ${pushname} apagou as seguintes mensagens:\n\n`;
  const messages = revogedMessages
    .map((msg) => {
      const formatedDate = formatDate(msg.revokedAt);

      return `- [${formatedDate}] "${msg.message}"`;
    })
    .join("\n\n");

  const content = header + messages;

  await message.reply(content);
}
