import { DownloadFactory } from "@/factories";
import { ICommand } from "../../types";

export const TikTokCommand: ICommand = {
  name: "/tiktok",
  description: "Baixa um vídeo do TikTok sem marca d'água",
  sintaxe: "/tiktok <link>",
  aliases: ["/tk", "/ttk"],
  onlyGroup: false,
  async execute({ message, client }) {
    const downloadService = DownloadFactory.getDownloadService(client, message);
    return await downloadService.tikTok();
  },
};
