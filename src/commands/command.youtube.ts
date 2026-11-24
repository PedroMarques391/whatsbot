import { DownloadFactory } from "@/factories";
import { ICommand } from "../../types";

export const YouTubeCommand: ICommand = {
  name: "/youtube",
  description:
    "Baixa um vídeo, shorts ou apenas o áudio (--onlyAudio / --oa) do YouTube",
  sintaxe: "/youtube <link> [--onlyAudio | --oa]",
  aliases: ["/yt", "/ytb", "/shorts"],
  onlyGroup: false,
  async execute({ message, client }) {
    const downloadService = DownloadFactory.getDownloadService(client, message);
    return await downloadService.youtube();
  },
};
