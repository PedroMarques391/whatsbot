import { StickerFactory } from "@/factories";
import { ICommand } from "../../types";

export const StickerCommand: ICommand = {
  name: "/sticker",
  description:
    "Cria uma figurinha a partir de imagem ou vídeo (use --audio para incluir som)",
  sintaxe: "/sticker [--audio]",
  aliases: ["/s"],
  onlyGroup: false,
  async execute({ message, chat, client }) {
    const stickerService = StickerFactory.getStickerService(client, message);
    await stickerService.makeSticker(chat.id._serialized);
  },
};
