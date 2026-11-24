import { Message, MessageMedia } from "whatsapp-web.js";

export type StickerMediaType = "image" | "video" | "sticker";

export interface ExtractedStickerAudio {
  media: MessageMedia;
  durationSeconds: number;
  sizeBytes: number;
}

export interface AudioProbeInfo {
  hasAudio: boolean;
  durationSeconds: number;
}

export interface WAWebStickerAudioDescriptor {
  deprecatedMms3Url?: string;
  directPath: string;
  mediaKey: string;
  mediaKeyTimestamp: number;
  filehash: string;
  encFilehash: string;
  size: number;
  duration: number;
  mimetype: string;
}

export interface SendStickerParams {
  type: StickerMediaType;
  message: Message;
  chatId: string;
  media: MessageMedia;
  stickerName?: string;
  withAudio?: boolean;
  audioMedia?: MessageMedia;
}

export interface DispatchStickerParams {
  chatId: string;
  stickerMedia: MessageMedia;
  stickerName: string;
  extractedAudio?: ExtractedStickerAudio | null;
  isAnimated?: boolean;
}
