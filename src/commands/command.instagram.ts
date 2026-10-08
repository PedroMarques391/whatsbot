import { DownloadFactory } from "@/factories";
import { ICommand } from "../../types";

export const InstagramCommand: ICommand = {
  name: "/instagram",
  description: "Baixa um vídeo ou reels do Instagram",
  sintaxe: "/instagram <link>",
  aliases: ["/ig", "/insta", "/reels"],
  onlyGroup: false,
  async execute({ message, client }) {
    const downloadService = DownloadFactory.getDownloadService(client, message);
    return await downloadService.instagram();
  },
};
