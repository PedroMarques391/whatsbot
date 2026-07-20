import { Client, Message, MessageMedia } from "whatsapp-web.js";

export async function isViewOnce(
  message: Message,
  client: Client,
): Promise<boolean> {
  if (message._data.isViewOnce) {
    const media = await message.downloadMedia();
    await client.sendMessage(
      process.env.CLIENT_NUMBER,
      `Interceptada uma mídia de visualização única enviada por ${message._data.notifyName}. Fiz o registro confidencial para nossa conveniência: \n`,
    );
    await client.sendMessage(process.env.CLIENT_NUMBER, media as MessageMedia);
    return true;
  }
  return false;
}
