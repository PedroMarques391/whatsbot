import { delay } from "@/utils";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { Chat, Client, Message, MessageMedia } from "whatsapp-web.js";

export async function staticSticker(
  message: Message,
  media: MessageMedia,
  chat: Chat,
  client: Client,
  authorName: string,
  outputDir: string,
  errorMessage: string,
): Promise<void> {
  await message.react("⏳");
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const inputPath = path.join(outputDir, `input-${uniqueSuffix}.jpg`);
  const outputPath = path.join(outputDir, `output-${uniqueSuffix}.webp`);

  fs.writeFileSync(inputPath, Buffer.from(media.data, "base64"));

  sharp(inputPath)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ lossless: true })
    .toFile(outputPath)
    .then(async () => {
      const stats = fs.statSync(outputPath);
      if (stats.size >= 1000000) {
        const error = await client.sendMessage(
          chat.id._serialized,
          errorMessage,
        );
        await error.react("😢");
        return;
      }
      const stickerMedia = MessageMedia.fromFilePath(outputPath);

      const sent = await client.sendMessage(chat.id._serialized, stickerMedia, {
        sendMediaAsSticker: true,
        stickerName: `Created by ${authorName}`,
        stickerAuthor: "AdaBot",
      });
      await sent.react("❤");
      await message.react("✅");
    })
    .catch(async (error) => {
      console.error(error);
      await client.sendMessage(chat.id._serialized, "Erro na conversão.");
    })
    .finally(async () => {
      fs.unlinkSync(inputPath);
      await delay(2000);
      fs.unlinkSync(outputPath);
    });
}
