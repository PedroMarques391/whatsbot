import { StickerHelper } from "@/helpers";
import { TimerUtils } from "@/utils";
import removeBackground from "@imgly/background-removal-node";
import fs from "fs";
import path from "path";
import { Chat, Client, Message, MessageMedia } from "whatsapp-web.js";

export async function removeBg(message: Message, chat: Chat, client: Client) {
  const quotedMessage = await message.getQuotedMessage();
  const sourceMessage = message.hasQuotedMsg ? quotedMessage : message;
  await sourceMessage.react("⏳");

  if (sourceMessage.type !== "image" && sourceMessage.type !== "sticker") {
    await sourceMessage
      .reply("😑 Sério mesmo? Esse comando é só pra imagens. Não tá claro? 🙃")
      .then(async (reply) => await reply.react("🙄"));
    await sourceMessage.react("❌");
    return;
  }

  const media = (await sourceMessage.downloadMedia()) as MessageMedia;

  const outputDir: string = path.resolve(
    process.cwd(),
    "src/assets/images/imageWithoutBg",
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const imagePath = path.join(outputDir, "image.jpg");
  const imageOutput = path.join(
    outputDir,
    `${message._data.notifyName.split(" ")[0]}.png`,
  );

  fs.writeFileSync(imagePath, Buffer.from(media.data, "base64"));

  await removeBackground(imagePath)
    .then(async (blob: Blob) => {
      const arrayBuffer = await blob.arrayBuffer();

      fs.writeFileSync(imageOutput, Buffer.from(arrayBuffer));

      const processedMedia = MessageMedia.fromFilePath(imageOutput);

      if (sourceMessage.type === "image") {
        await client
          .sendMessage(chat.id._serialized, processedMedia, {
            sendMediaAsDocument: true,
            caption: "Aqui está sua imagem com o fundo removido! ",
          })
          .then(async (sentDoc) => await sentDoc.react("❤️"));
        await sourceMessage.react("⌛");
        return;
      }

      if (sourceMessage.type === "sticker") {
        const stickerHelper = new StickerHelper(client);
        const sentSticker = await stickerHelper.sendSticker({
          type: "image",
          message,
          chatId: chat.id._serialized,
          media: processedMedia,
        });
        if (sentSticker) {
          await Promise.all([
            sentSticker.react("❤️").catch(() => undefined),
            message.react("❤️").catch(() => undefined),
          ]);
        }
        return;
      }
    })
    .catch(async (error) => {
      console.error("Erro ao remover o fundo:", error);
      await sourceMessage
        .reply(
          "Não consegui processar esse arquivo. Ou está corrompido, ou o sistema cansou de você. Tente mais tarde.",
        )
        .then(async (reply) => await reply.react("❌"));
      await sourceMessage.react("❌");
    })
    .finally(async () => {
      await sourceMessage.react("✅");
      fs.unlinkSync(imagePath);
      await TimerUtils.delay(2000);
      fs.unlinkSync(imageOutput);
    });
}
