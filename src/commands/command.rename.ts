import { renameSticker } from "@/services";
import { ICommand } from "../../types";

export const RenameCommand: ICommand = {
  name: "/rename",
  description: "Renomeia o autor de uma figurinha",
  sintaxe: "/rename <novo autor>",
  onlyGroup: false,
  async execute({ client, message, chat }) {
    await renameSticker(message, chat, client);
  },
};
