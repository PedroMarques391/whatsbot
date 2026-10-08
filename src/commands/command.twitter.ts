import { DownloadFactory } from "@/factories";
import { ICommand } from "../../types";

export const TwitterCommand: ICommand = {
  name: "/twitter",
  description: "Baixa um vídeo do Twitter / X",
  sintaxe: "/twitter <link>",
  aliases: ["/tw", "/x"],
  onlyGroup: false,
  async execute({ message, client }) {
    const downloadService = DownloadFactory.getDownloadService(client, message);
    return await downloadService.twitter();
  },
};
