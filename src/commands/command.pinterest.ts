import { DownloadFactory } from "@/factories";
import { ICommand } from "../../types";

export const PinterestCommand: ICommand = {
  name: "/pinterest",
  description: "Baixa um vídeo ou mídia do Pinterest",
  sintaxe: "/pinterest <link>",
  aliases: ["/pin"],
  onlyGroup: false,
  async execute({ message, client }) {
    const downloadService = DownloadFactory.getDownloadService(client, message);
    return await downloadService.pinterest();
  },
};
