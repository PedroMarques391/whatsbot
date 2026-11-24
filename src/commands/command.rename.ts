import { StickerFactory } from "@/factories";
import { ICommand } from "../../types";

export const RenameCommand: ICommand = {
  name: "/rename",
  description: "Renomeia o autor de uma figurinha",
  sintaxe: "/rename <novo autor>",
  onlyGroup: false,
  async execute({ client, message, chat }) {
    const stickerService = StickerFactory.getStickerService(client, message);
    await stickerService.renameSticker(chat);
  },
};
