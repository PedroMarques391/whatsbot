import { StickerHelper } from "@/helpers";
import { StickerService } from "@/services/sticker";
import { Client, Message } from "whatsapp-web.js";

export class StickerFactory {
  static getStickerService(client: Client, message: Message): StickerService {
    const stickerHelper = new StickerHelper(client);
    return new StickerService(message, stickerHelper);
  }
}
