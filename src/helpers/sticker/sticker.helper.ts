import { MessageUtils } from "@/utils";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { Client, Message, MessageMedia } from "whatsapp-web.js";
import {
  AudioProbeInfo,
  DispatchStickerParams,
  ExtractedStickerAudio,
  SendStickerParams,
  WAWebStickerAudioDescriptor,
} from "../../../types";

export class StickerHelper {
  private readonly MAX_STATIC_AUDIO_DURATION = 10;
  private readonly MAX_ANIMATED_AUDIO_DURATION = 10;
  private readonly MAX_STICKER_AUDIO_SIZE_BYTES = 500 * 1024;
  private readonly MAX_STICKER_WEBP_BYTES = 1_000_000;
  private readonly STICKER_AUTHOR = "adabot";
  private readonly DEFAULT_CREATOR = "ada";
  private readonly STICKER_CATEGORIES = [
    "sticker",
    "adabot",
    "engraçado",
    "meme",
    "whatsapp",
    "ada.ai",
  ];

  constructor(private readonly client: Client) {}

  static async enableSoundStickerGating(client: Client): Promise<boolean> {
    if (!client.pupPage) {
      return false;
    }

    return client.pupPage
      .evaluate(() => {
        const wReq = (
          globalThis as unknown as { require?: (id: string) => any }
        ).require;
        if (typeof wReq !== "function") return false;

        const soundGating = wReq("WAWebSoundStickerGating");
        if (!soundGating) return false;

        soundGating.isSoundStickerConsumptionEnabled = () => true;
        soundGating.isSoundStickerCreationEnabled = () => true;
        soundGating.isSoundStickerPlaybackEnabled = () => true;
        return true;
      })
      .catch(() => false);
  }

  async sendSticker({
    type,
    message,
    chatId,
    media,
    stickerName,
    withAudio = false,
    audioMedia,
  }: SendStickerParams): Promise<Message | null> {
    const creatorName = message._data?.notifyName || this.DEFAULT_CREATOR;
    const resolvedStickerName = stickerName ?? `Created by ${creatorName}`;
    const outputDir = this.ensureOutputDir();
    const tempFiles: string[] = [];

    try {
      let extractedAudio: ExtractedStickerAudio | null = null;

      if (withAudio) {
        const maxDuration =
          type === "video"
            ? this.MAX_ANIMATED_AUDIO_DURATION
            : this.MAX_STATIC_AUDIO_DURATION;
        const audioSource = audioMedia?.data
          ? audioMedia
          : type === "video"
            ? media
            : null;

        if (audioSource) {
          extractedAudio = await this.extractStickerAudio(
            audioSource,
            outputDir,
            maxDuration,
          );
        }

        if (!extractedAudio) {
          const reply = await message.reply(
            "Figurinha com áudio... sem áudio? Conceito ousado. Manda um vídeo com som ou responde a um áudio usando */sticker --audio* (ou */s --audio*). 🔇🙄",
          );
          await reply.react("🔇").catch(() => undefined);
          await message.react("❌").catch(() => undefined);
          return null;
        }
      }

      if (type === "sticker") {
        return await this.dispatchSticker({
          chatId,
          stickerMedia: media,
          stickerName: resolvedStickerName,
          extractedAudio,
        });
      }

      const webpPath =
        type === "video"
          ? await this.createDynamicWebp(
              media,
              outputDir,
              withAudio ? this.MAX_ANIMATED_AUDIO_DURATION : 10,
              tempFiles,
            )
          : await this.createStaticWebp(media, outputDir, tempFiles);

      const stats = fs.statSync(webpPath);
      if (stats.size >= this.MAX_STICKER_WEBP_BYTES) {
        const error = await this.client.sendMessage(
          chatId,
          MessageUtils.errorMessages("sticker"),
        );
        await error.react("😢").catch(() => undefined);
        await message.react("❌").catch(() => undefined);
        return null;
      }

      return await this.dispatchSticker({
        chatId,
        stickerMedia: MessageMedia.fromFilePath(webpPath),
        stickerName: resolvedStickerName,
        extractedAudio,
        isAnimated: type === "video",
      });
    } catch (error) {
      console.error(error);
      const failureMsg =
        type === "video"
          ? "Esse vídeo tá tão problemático que até o FFmpeg desistiu dele. Manda um arquivo que preste na próxima. 🙄"
          : "Parabéns, conseguiu quebrar a conversão da imagem. Manda um arquivo decente e tenta de novo. 🙄";
      await this.client.sendMessage(chatId, failureMsg).catch(() => undefined);
      await message.react("❌").catch(() => undefined);
      return null;
    } finally {
      for (const filePath of tempFiles) {
        this.safeUnlink(filePath);
      }
    }
  }

  private ensureOutputDir(): string {
    const outputDir = path.resolve(process.cwd(), "src/assets/stickers");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    return outputDir;
  }

  private createUniqueSuffix(): string {
    return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  }

  private safeUnlink(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.warn(
        `Não foi possível remover arquivo temporário: ${filePath}`,
        err,
      );
    }
  }

  private resolveExtensionFromMime(mimetype?: string): string {
    if (!mimetype) return "bin";
    if (mimetype.includes("mp4")) return "mp4";
    if (mimetype.includes("ogg") || mimetype.includes("opus")) return "ogg";
    if (mimetype.includes("mpeg") || mimetype.includes("mp3")) return "mp3";
    if (mimetype.includes("wav")) return "wav";
    if (mimetype.includes("webm")) return "webm";
    if (mimetype.includes("aac") || mimetype.includes("m4a")) return "m4a";
    return "bin";
  }

  private async createStaticWebp(
    media: MessageMedia,
    outputDir: string,
    tempFiles: string[],
  ): Promise<string> {
    const uniqueSuffix = this.createUniqueSuffix();
    const inputPath = path.join(outputDir, `input-${uniqueSuffix}.jpg`);
    const outputPath = path.join(outputDir, `output-${uniqueSuffix}.webp`);
    tempFiles.push(inputPath, outputPath);

    fs.writeFileSync(inputPath, Buffer.from(media.data, "base64"));

    const pipeline = sharp(inputPath).resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });

    await pipeline.clone().webp({ lossless: true }).toFile(outputPath);

    if (fs.statSync(outputPath).size >= this.MAX_STICKER_WEBP_BYTES) {
      await pipeline.clone().webp({ quality: 80 }).toFile(outputPath);
    }

    return outputPath;
  }

  private async runDynamicWebpEncode(
    inputPath: string,
    outputPath: string,
    durationSeconds: number,
    fps: number,
    quality: number,
    scale = 512,
  ): Promise<void> {
    const filter =
      scale < 512
        ? `fps=${fps},scale=${scale}:${scale}:force_original_aspect_ratio=increase,crop=${scale}:${scale},pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000`
        : `fps=${fps},scale=512:512:force_original_aspect_ratio=increase,crop=512:512`;

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(0)
        .setDuration(durationSeconds)
        .output(outputPath)
        .outputFormat("webp")
        .videoCodec("libwebp")
        .outputOptions([
          `-vf ${filter}`,
          "-loop 0",
          "-preset default",
          "-compression_level 6",
          `-q:v ${quality}`,
        ])
        .noAudio()
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });
  }

  private async createDynamicWebp(
    media: MessageMedia,
    outputDir: string,
    durationSeconds: number,
    tempFiles: string[],
  ): Promise<string> {
    const uniqueSuffix = this.createUniqueSuffix();
    const inputPath = path.join(outputDir, `video-in-${uniqueSuffix}.mp4`);
    const outputPath = path.join(outputDir, `video-out-${uniqueSuffix}.webp`);
    tempFiles.push(inputPath, outputPath);

    fs.writeFileSync(inputPath, Buffer.from(media.data, "base64"));

    await this.runDynamicWebpEncode(
      inputPath,
      outputPath,
      durationSeconds,
      10,
      45,
      512,
    );

    if (fs.statSync(outputPath).size >= this.MAX_STICKER_WEBP_BYTES) {
      await this.runDynamicWebpEncode(
        inputPath,
        outputPath,
        durationSeconds,
        8,
        25,
        360,
      );
    }

    return outputPath;
  }

  private probeAudioStream(filePath: string): Promise<AudioProbeInfo> {
    return new Promise((resolve) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err || !metadata?.streams) {
          resolve({ hasAudio: false, durationSeconds: 0 });
          return;
        }
        const audioStream = metadata.streams.find(
          (stream) => stream.codec_type === "audio",
        );
        if (!audioStream) {
          resolve({ hasAudio: false, durationSeconds: 0 });
          return;
        }

        const rawDuration = Number(
          audioStream.duration ?? metadata.format?.duration ?? 0,
        );
        const durationSeconds =
          Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 0;

        resolve({
          hasAudio: true,
          durationSeconds,
        });
      });
    });
  }

  private async extractStickerAudio(
    media: MessageMedia,
    outputDir: string,
    maxDurationSeconds: number,
  ): Promise<ExtractedStickerAudio | null> {
    const uniqueSuffix = this.createUniqueSuffix();
    const ext = this.resolveExtensionFromMime(media.mimetype);
    const inputPath = path.join(outputDir, `audio-in-${uniqueSuffix}.${ext}`);
    const outputPath = path.join(outputDir, `audio-out-${uniqueSuffix}.ogg`);

    fs.writeFileSync(inputPath, Buffer.from(media.data, "base64"));

    try {
      const inputProbe = await this.probeAudioStream(inputPath);
      if (!inputProbe.hasAudio) {
        return null;
      }

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .noVideo()
          .setStartTime(0)
          .setDuration(maxDurationSeconds)
          .audioCodec("libopus")
          .audioBitrate("64k")
          .audioChannels(1)
          .audioFrequency(48000)
          .outputFormat("ogg")
          .output(outputPath)
          .on("end", () => resolve())
          .on("error", (err) => reject(err))
          .run();
      });

      if (!fs.existsSync(outputPath)) {
        return null;
      }

      const stats = fs.statSync(outputPath);
      if (stats.size <= 0 || stats.size > this.MAX_STICKER_AUDIO_SIZE_BYTES) {
        return null;
      }

      const effectiveDuration =
        inputProbe.durationSeconds > 0
          ? inputProbe.durationSeconds
          : maxDurationSeconds;

      const clampedDuration = Math.max(
        1,
        Math.min(maxDurationSeconds, Math.round(effectiveDuration)),
      );

      const audioMedia = MessageMedia.fromFilePath(outputPath);
      audioMedia.mimetype = "audio/ogg; codecs=opus";

      return {
        media: audioMedia,
        durationSeconds: clampedDuration,
        sizeBytes: stats.size,
      };
    } finally {
      this.safeUnlink(inputPath);
      this.safeUnlink(outputPath);
    }
  }

  private async uploadStickerAudioDescriptor(
    chatId: string,
    extractedAudio: ExtractedStickerAudio,
  ): Promise<WAWebStickerAudioDescriptor> {
    if (!this.client.pupPage) {
      throw new Error(
        "Página Puppeteer do WhatsApp Web indisponível para upload E2E do áudio da figurinha.",
      );
    }

    const { media, durationSeconds } = extractedAudio;

    return this.client.pupPage.evaluate(
      async (
        audioMediaInfo: { data: string; mimetype: string; filename: string },
        duration: number,
        targetChatId: string,
      ) => {
        const win = globalThis as unknown as {
          require: (id: string) => any;
          WWebJS: any;
          crypto: { getRandomValues: (arr: Uint8Array) => Uint8Array };
        };

        const wReq = win.require;
        if (typeof wReq !== "function" || !win.WWebJS) {
          throw new Error(
            "Runtime interno do WhatsApp Web (WWebJS) não carregado.",
          );
        }

        const soundGating = wReq("WAWebSoundStickerGating");
        if (soundGating) {
          soundGating.isSoundStickerConsumptionEnabled = () => true;
          soundGating.isSoundStickerCreationEnabled = () => true;
          soundGating.isSoundStickerPlaybackEnabled = () => true;
        }

        const file = win.WWebJS.mediaInfoToFile(audioMediaInfo);
        const filehash: string = await win.WWebJS.getFileHash(file);

        let descriptor: WAWebStickerAudioDescriptor;

        try {
          const mediaData = await win.WWebJS.processMediaData(audioMediaInfo, {
            forceSticker: false,
            forceGif: false,
            forceVoice: false,
            forceDocument: false,
            forceMediaHd: false,
            sendToChannel: false,
            sendToStatus: false,
          });

          descriptor = {
            deprecatedMms3Url:
              mediaData.deprecatedMms3Url || mediaData.clientUrl || undefined,
            directPath: mediaData.directPath,
            mediaKey: mediaData.mediaKey,
            mediaKeyTimestamp:
              typeof mediaData.mediaKeyTimestamp === "number"
                ? mediaData.mediaKeyTimestamp
                : Math.floor(Date.now() / 1000),
            filehash: mediaData.filehash || filehash,
            encFilehash: mediaData.encFilehash || mediaData.uploadhash,
            size:
              typeof mediaData.size === "number" && mediaData.size > 0
                ? mediaData.size
                : file.size,
            duration,
            mimetype: audioMediaInfo.mimetype,
          };
        } catch {
          const rawKey = win.crypto.getRandomValues(new Uint8Array(32));
          const mediaKey: string = wReq("WABase64").encodeB64(rawKey);
          const controller = new AbortController();

          const uploadedInfo = await wReq(
            "WAWebUploadManager",
          ).encryptAndUpload({
            blob: file,
            type: "audio",
            signal: controller.signal,
            mediaKey,
            uploadQpl: wReq("WAWebStartMediaUploadQpl").startMediaUploadQpl({
              entryPoint: "MediaUpload",
            }),
          });

          descriptor = {
            deprecatedMms3Url: uploadedInfo.url,
            directPath: uploadedInfo.directPath,
            mediaKey: uploadedInfo.mediaKey || mediaKey,
            mediaKeyTimestamp:
              typeof uploadedInfo.mediaKeyTimestamp === "number"
                ? uploadedInfo.mediaKeyTimestamp
                : Math.floor(Date.now() / 1000),
            filehash,
            encFilehash: uploadedInfo.encFilehash,
            size: file.size,
            duration,
            mimetype: audioMediaInfo.mimetype,
          };
        }

        const soundUtils = wReq("WAWebSoundStickerUtils");
        if (soundUtils) {
          if (!soundUtils.isCompleteStickerAudio(descriptor)) {
            throw new Error(
              "Descritor stickerAudio inválido segundo WAWebSoundStickerUtils.isCompleteStickerAudio.",
            );
          }

          const widFactory = wReq("WAWebWidFactory");
          if (widFactory) {
            const toWid = widFactory.createWid(targetChatId);
            if (!soundUtils.canSendStickerAudio(descriptor, toWid)) {
              throw new Error(
                "O destinatário não suporta figurinhas com áudio nativas (ex.: canal, status ou bot).",
              );
            }
          }
        }

        return descriptor;
      },
      {
        data: media.data,
        mimetype: media.mimetype,
        filename: media.filename || "sticker-audio.ogg",
      },
      durationSeconds,
      chatId,
    );
  }

  private async dispatchSticker({
    chatId,
    stickerMedia,
    stickerName,
    extractedAudio,
    isAnimated,
  }: DispatchStickerParams): Promise<Message> {
    const baseStickerOptions: Record<string, unknown> = {
      sendMediaAsSticker: true,
      stickerName,
      stickerAuthor: this.STICKER_AUTHOR,
      stickerCategories: this.STICKER_CATEGORIES,
    };

    if (!extractedAudio) {
      return this.client.sendMessage(chatId, stickerMedia, baseStickerOptions);
    }

    const stickerAudio = await this.uploadStickerAudioDescriptor(
      chatId,
      extractedAudio,
    );

    return this.client.sendMessage(chatId, stickerMedia, {
      ...baseStickerOptions,
      extra: {
        stickerAudio,
        ...(typeof isAnimated === "boolean" ? { isAnimated } : {}),
      },
    } as Record<string, unknown>);
  }
}
