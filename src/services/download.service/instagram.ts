import { delay, extractTextFromBody } from "@/utils";
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import { IInstagramResponse } from "../../../types";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST_INSTAGRAM;

export async function downloadInstagram(message: Message, client: Client) {
  const quotedMessage = await message.getQuotedMessage();
  const url = message.hasQuotedMsg
    ? quotedMessage.body
    : extractTextFromBody(message.body);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  if (!url) {
    await client.sendMessage(
      message.from,
      "Parece que faltou o link do vídeo. Coloque o link junto ao comando para eu conseguir baixar. ✨",
    );
    return;
  }

  const isValidInstagramUrl =
    /^https?:\/\/([a-z0-9-]+\.)?instagram\.com\/.+$/i.test(url);

  if (!isValidInstagramUrl && message.body.includes("baixar")) return;

  if (!isValidInstagramUrl) {
    await client
      .sendMessage(
        message.from,
        "Parece que tem algo errado com a URL fornecida. Podemos tentar novamente com a URL correta? ☕",
      )
      .then(async (message) => await message.react("❌"));
    return;
  }

  await message.react("⏳");
  await delay(2000);
  await message.react("⌛");
  await client
    .sendMessage(
      message.from,
      "Iniciando o download do vídeo. Isso levará apenas um momento...",
    )
    .then(async (message) => await message.react("☕"));

  try {
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
      throw new Error("Configurações da RapidAPI ausentes no .env");
    }

    const apiUrl = `https://${RAPIDAPI_HOST}/get-info-rapidapi?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const remaining = response.headers.get("x-ratelimit-requests-remaining");
    const limit = response.headers.get("x-ratelimit-requests-limit");
    if (remaining) {
      console.log(`[AdaBot: Instagram limit] Restante: ${remaining}/${limit ?? "100"}`);
    }

    const data = (await response.json()) as IInstagramResponse;

    const videoUrl = data?.download_url;

    if (!data || data.error || !videoUrl) {
      await client.sendMessage(
        message.from,
        "Ocorreu uma falha ao acessar esse vídeo. Tem certeza de que ele está disponível e é público? ✨",
      );
      return;
    }

    const media = await MessageMedia.fromUrl(videoUrl, { unsafeMime: true });

    await delay(1000);

    const captionLimit = 500;
    const captionText = data.caption?.trim();
    const finalCaption = captionText
      ? captionText.length > captionLimit
        ? `🎬 *Instagram*\n\n${captionText.slice(0, captionLimit).trim()}...\n\n_Aqui está seu vídeo. ✨_`
        : `🎬 *Instagram*\n\n${captionText}\n\n_Aqui está seu vídeo. ✨_`
      : "Aqui está seu vídeo. ✨";

    await client
      .sendMessage(message.from, media, {
        caption: finalCaption,
        sendMediaAsDocument: false,
      })
      .then(async (message) => await message.react("✅"));

    await message.react("✅");
  } catch (error) {
    console.error(
      "[AdaBot] Erro ao baixar ou enviar o vídeo do Instagram:",
      error,
    );
    await client
      .sendMessage(
        message.from,
        "Tive um contratempo interno ao processar e enviar esse arquivo. Tente novamente mais tarde. ☕",
      )
      .then(async (message) => await message.react("❌"));
    await message.react("");
  }
}
