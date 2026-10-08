import { delay, extractTextFromBody, isValidUrl } from "@/utils";
import { PlatformType } from "@/utils/urls";
import fs from "node:fs/promises";
import path from "node:path";
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import youtubedl from "youtube-dl-exec";
import { IInstagramResponse, ITikTokResponse } from "../../types";

export class DownloadService {
  private readonly TIKTOK_API_URL = "https://www.tikwm.com/api/";
  private readonly RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  private readonly RAPIDAPI_HOST_INSTAGRAM =
    process.env.RAPIDAPI_HOST_INSTAGRAM;
  private readonly MAX_DOWNLOAD_SIZE_MB = 60;

  constructor(
    private readonly client: Client,
    private readonly message: Message,
  ) {}

  async instagram(): Promise<void> {
    const url = await this.extractTargetUrl();
    const isValid = await this.validateUrl(url, "instagram");
    if (!isValid || !url) return;

    await this.notifyStart();

    try {
      if (!this.RAPIDAPI_KEY || !this.RAPIDAPI_HOST_INSTAGRAM) {
        throw new Error("Configurações da RapidAPI ausentes no .env");
      }

      const apiUrl = `https://${this.RAPIDAPI_HOST_INSTAGRAM}/get-info-rapidapi?url=${encodeURIComponent(url)}`;
      const data = await this.fetchJson<IInstagramResponse>(
        apiUrl,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": this.RAPIDAPI_KEY,
            "x-rapidapi-host": this.RAPIDAPI_HOST_INSTAGRAM,
          },
        },
        15000,
      );

      const videoUrl = data?.download_url;

      if (!data || data.error || !videoUrl) {
        await this.client.sendMessage(
          this.message.from,
          "Não consegui acessar esse vídeo do Instagram. Ou o perfil é privado, ou o vídeo foi excluído, ou esse link não presta! ",
        );
        return;
      }

      const caption = this.formatCaption("Instagram", data.caption);
      await this.sendMedia(videoUrl, caption);
    } catch (error) {
      await this.handleError(error);
    }
  }

  async tikTok(): Promise<void> {
    const url = await this.extractTargetUrl();
    const isValid = await this.validateUrl(url, "tiktok");
    if (!isValid || !url) return;

    await this.notifyStart();

    try {
      const endpoint = `${this.TIKTOK_API_URL}?url=${encodeURIComponent(url)}&count=1&version=1`;
      const data = await this.fetchJson<ITikTokResponse>(endpoint);

      const videoUrl = data.data?.play;

      if (!videoUrl) {
        await this.client.sendMessage(
          this.message.from,
          "Não consegui acessar esse vídeo do TikTok. Vê se o vídeo ainda existe e é público antes de me mandar!",
        );
        return;
      }

      const caption = this.formatCaption("TikTok", data.data?.title);
      await this.sendMedia(videoUrl, caption);
    } catch (error) {
      await this.handleError(error);
    }
  }

  async youtube(): Promise<void> {
    return this.downloadWithYtDlp(
      "youtube",
      "YouTube",
      "bestvideo[height<=720][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=720][vcodec^=avc]/best",
    );
  }

  async twitter(): Promise<void> {
    return this.downloadWithYtDlp(
      "twitter",
      "Twitter / X",
      "best[ext=mp4]/bestvideo[height<=720]+bestaudio/best",
    );
  }

  async pinterest(): Promise<void> {
    return this.downloadWithYtDlp(
      "pinterest",
      "Pinterest",
      "best[ext=mp4]/best",
    );
  }

  private async downloadWithYtDlp(
    platform: PlatformType,
    displayName: string,
    format: string,
  ): Promise<void> {
    const url = await this.extractTargetUrl();
    const isValid = await this.validateUrl(url, platform);
    if (!isValid || !url) return;

    await this.notifyStart();

    const jobDir = path.resolve(__dirname, `../../temp/${Date.now()}`);

    try {
      await fs.mkdir(jobDir, { recursive: true });

      await youtubedl(url, {
        output: path.join(jobDir, "%(title).80s.%(ext)s"),
        format,
        mergeOutputFormat: "mp4",
        noCheckCertificates: true,
        noWarnings: true,
      });

      const files = await fs.readdir(jobDir);
      const videoFile = files.find((f) => f.endsWith(".mp4"));

      if (!videoFile) {
        throw new Error(
          `Vídeo do ${displayName} não encontrado após o download.`,
        );
      }

      const filePath = path.join(jobDir, videoFile);

      const stats = await fs.stat(filePath);
      const maxBytes = this.MAX_DOWNLOAD_SIZE_MB * 1024 * 1024;

      if (stats.size > maxBytes) {
        const sizeMb = (stats.size / (1024 * 1024)).toFixed(1);
        await this.client.sendMessage(
          this.message.from,
          `O vídeo é muito pesado (${sizeMb} MB)! Tá achando que eu tenho memória infinita seu ignóbil?! O limite é de ${this.MAX_DOWNLOAD_SIZE_MB} MB. `,
        );
        await this.message.react("❌");
        return;
      }

      const media = MessageMedia.fromFilePath(filePath);
      const title = path.parse(videoFile).name;
      const caption = this.formatCaption(displayName, title);

      const sendMediaAsDocument = stats.size > 16 * 1024 * 1024;

      await delay(1000);

      const sentMessage = await this.client.sendMessage(
        this.message.from,
        media,
        {
          caption,
          sendMediaAsDocument,
        },
      );

      await sentMessage.react("✅");
      await this.message.react("✅");
    } catch (error) {
      await this.handleError(error);
    } finally {
      await fs.rm(jobDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  private async extractTargetUrl(): Promise<string> {
    const quotedMessage = await this.message.getQuotedMessage();
    if (this.message.hasQuotedMsg && quotedMessage?.body?.length) {
      return quotedMessage.body.trim();
    }
    return extractTextFromBody(this.message.body) ?? "";
  }

  private async validateUrl(
    url: string,
    platform: PlatformType,
  ): Promise<boolean> {
    if (!url) {
      await this.client.sendMessage(
        this.message.from,
        "Cadê o link? Não sou vidente pra adivinhar o vídeo. Manda a URL junto com o comando! ",
      );
      return false;
    }

    const isValid = isValidUrl(url, platform);

    if (!isValid) {
      if (this.message.body.includes("baixar")) return false;

      const errorMessage = await this.client.sendMessage(
        this.message.from,
        "Essa URL é completamente inválida ou tá quebrada. Manda um link que preste! ",
      );
      await errorMessage.react("❌");
      return false;
    }

    return true;
  }

  private async notifyStart(
    text = "Iniciando o download do vídeo. Isso levará apenas um momento...",
  ): Promise<void> {
    await this.message.react("⏳");
    await delay(2000);
    await this.message.react("⌛");

    const infoMessage = await this.client.sendMessage(this.message.from, text);
    await infoMessage.react("☕");
  }

  private async fetchJson<T>(
    url: string,
    options?: RequestInit,
    timeoutMs = 15000,
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      const remaining = response.headers.get("x-ratelimit-requests-remaining");
      const limit = response.headers.get("x-ratelimit-requests-limit");
      if (remaining) {
        console.log(
          `[AdaBot: Rate Limit] Restante: ${remaining}/${limit ?? "100"}`,
        );
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async sendMedia(
    mediaUrl: string,
    caption = "Aqui está seu vídeo. ✨",
  ): Promise<void> {
    const media = await MessageMedia.fromUrl(mediaUrl, { unsafeMime: true });
    await delay(1000);

    const sentMessage = await this.client.sendMessage(
      this.message.from,
      media,
      {
        caption,
        sendMediaAsDocument: false,
      },
    );

    await sentMessage.react("✅");
    await this.message.react("✅");
  }

  private formatCaption(platform: string, description?: string | null): string {
    const captionLimit = 500;
    const text = description?.trim();
    if (!text) return "Aqui está seu vídeo. ✨";

    const formattedText =
      text.length > captionLimit
        ? `${text.slice(0, captionLimit).trim()}...`
        : text;

    return `🎬 *${platform}*\n\n${formattedText}\n\n_Aqui está seu vídeo. ✨_`;
  }

  private async handleError(error: unknown): Promise<void> {
    console.error("[AdaBot] Erro ao baixar ou enviar a mídia:", error);

    const errorMessage = await this.client.sendMessage(
      this.message.from,
      "Deu ruim ao processar e baixar essa mídia. O serviço falhou ou o arquivo tá inacessível. Tenta de novo mais tarde!",
    );

    await errorMessage.react("❌");
    await this.message.react("");
  }
}
