/// <reference path="./whatsapp.d.ts" />
/// <reference path="./env.d.ts" />

import { ICommand } from "./commands";
import { IYtDlpDownloadOptions } from "./download.type";
import { IInstagramResponse } from "./instagram.type";
import {
  AudioProbeInfo,
  DispatchStickerParams,
  ExtractedStickerAudio,
  SendStickerParams,
  StickerMediaType,
  WAWebStickerAudioDescriptor,
} from "./sticker.type";
import { ITikTokResponse } from "./tiktok.type";
import { PlatformType, SerializedMention } from "./utils.type";

export type {
  AudioProbeInfo,
  DispatchStickerParams,
  ExtractedStickerAudio,
  ICommand,
  IInstagramResponse,
  ITikTokResponse,
  IYtDlpDownloadOptions,
  PlatformType,
  SendStickerParams,
  SerializedMention,
  StickerMediaType,
  WAWebStickerAudioDescriptor,
};
