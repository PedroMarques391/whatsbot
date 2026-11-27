import { StickerHelper } from "@/helpers";
import { ReactionLoadingUtils, StringUtils } from "@/utils";
import { Chat, Message, MessageMedia } from "whatsapp-web.js";

export class StickerService {
  constructor(
    private readonly message: Message,
    private readonly stickerHelper: StickerHelper,
  ) {}

  async makeSticker(chatId: string, hasAudioFlag?: boolean): Promise<void> {
    const withAudio = hasAudioFlag ? hasAudioFlag : this.hasAudioFlag();
    const quotedMessage = this.message.hasQuotedMsg
      ? await this.message.getQuotedMessage()
      : null;

    const sourceMessage = this.resolveSourceMessage(quotedMessage);
    if (!sourceMessage) {
      await this.replyEmptyMedia();
      return;
    }

    const audioMessage =
      withAudio &&
      sourceMessage === this.message &&
      quotedMessage &&
      this.isAudioMessage(quotedMessage)
        ? quotedMessage
        : null;

    const stopLoading = ReactionLoadingUtils.start(this.message);

    try {
      const [media, audioMedia] = await Promise.all([
        sourceMessage.downloadMedia() as Promise<MessageMedia>,
        audioMessage
          ? (audioMessage.downloadMedia() as Promise<MessageMedia | undefined>)
          : Promise.resolve(undefined),
      ]);

      if (!media?.data) {
        stopLoading();
        await this.replyEmptyMedia();
        return;
      }

      const sentSticker = await this.stickerHelper.sendSticker({
        type: sourceMessage.type === "video" ? "video" : "image",
        message: this.message,
        chatId,
        media,
        withAudio,
        audioMedia,
      });

      stopLoading();
      if (sentSticker) {
        await this.reactCompleted(sentSticker);
      }
    } finally {
      stopLoading();
    }
  }

  async renameSticker(chat: Chat): Promise<void> {
    const stickerName = StringUtils.extractTextFromBody(this.message.body);
    const quotedMessage = await this.message.getQuotedMessage();

    if (!this.message.hasQuotedMsg || quotedMessage.type !== "sticker") {
      await this.message
        .reply(
          "Você quer que eu renomeie o quê exatamente? O vazio? Marca uma figurinha primeiro! 🙄",
        )
        .then(async (reply) => await reply.react("👀"));
      await this.message.react("❌");
      return;
    }

    if (stickerName.length > 20 || stickerName.length === 0) {
      const replyText =
        stickerName.length > 20
          ? "Escreveu um TCC no nome da figurinha? O limite é 20 caracteres, abrevia isso aí. 🙄"
          : "Renomear pra... nada? Digita algum nome depois do comando, não sou vidente. ☕";
      await this.message
        .reply(replyText)
        .then(async (reply) => await reply.react("🙄"));
      await this.message.react("❌");
      return;
    }

    const stopLoading = ReactionLoadingUtils.start(this.message);

    try {
      const media = (await quotedMessage.downloadMedia()) as MessageMedia;

      const sentSticker = await this.stickerHelper.sendSticker({
        type: "sticker",
        message: this.message,
        chatId: chat.id._serialized,
        media,
        stickerName,
      });

      stopLoading();
      if (sentSticker) {
        await this.reactCompleted(sentSticker);
      }
    } finally {
      stopLoading();
    }
  }

  private async reactCompleted(sentSticker: Message): Promise<void> {
    await Promise.all([
      sentSticker.react("❤️").catch(() => undefined),
      this.message.react("❤️").catch(() => undefined),
    ]);
  }

  private isMedia(msg: Message | null): msg is Message {
    return Boolean(msg && (msg.type === "image" || msg.type === "video"));
  }

  private isAudioMessage(msg: Message): boolean {
    return msg.type === "audio";
  }

  private hasAudioFlag(): boolean {
    const argsText = StringUtils.extractTextFromBody(
      this.message.body,
    ).toLowerCase();
    return /(?:^|\s)--audio(?:\s|$)/i.test(argsText);
  }

  private resolveSourceMessage(quotedMessage: Message | null): Message | null {
    if (this.isMedia(this.message)) return this.message;
    if (this.isMedia(quotedMessage)) return quotedMessage;
    return null;
  }

  private async replyEmptyMedia(): Promise<void> {
    await this.message
      .reply(
        "Quer que eu crie figurinha do vento? Manda ou marca uma imagem ou um vídeo primeiro, né. 🙄",
      )
      .then((sent: Message) => sent.react("🙄").catch(() => undefined));
    await this.message.react("❌").catch(() => undefined);
  }
}
