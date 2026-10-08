import { DownloadService } from "@/services/download.service";
import { Client, Message } from "whatsapp-web.js";

export class DownloadFactory {
  static getDownloadService(client: Client, message: Message): DownloadService {
    return new DownloadService(client, message);
  }
}
