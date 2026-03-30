import { setExitMessage } from "@/services";
import { ICommand } from "types";
import { GroupChat } from "whatsapp-web.js";

export const SetExitMessageCommand: ICommand = {
  name: "/setLeft",
  description: "Define uma mensagem de saída personalizada para o grupo.",
  sintaxe: "/setLeft <mensagem>",
  onlyGroup: true,
  execute: async ({ chat, message }) => {
    await setExitMessage(chat as GroupChat, message);
  },
};
