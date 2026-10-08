import { DownloadFactory } from "@/factories";
import { ICommand } from "../../types";

export const YouTubeCommand: ICommand = {
  name: "/youtube",
  description: "Baixa um vídeo ou shorts do YouTube",
  sintaxe: "/youtube <link>",
  aliases: ["/yt", "/ytb", "/shorts"],
  onlyGroup: false,
  async execute({ message, client }) {
    const downloadService = DownloadFactory.getDownloadService(client, message);
    return await downloadService.youtube();
  },
};
