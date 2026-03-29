import { setExitMessage } from "@/services";
import { ICommand } from "types";
import { GroupChat } from "whatsapp-web.js";

export const SetExitMessageCommand: ICommand = {
  name: "/setExit",
  description: "Define uma mensagem de saída personalizada para o grupo.",
  sintaxe: "/setExit <mensagem>",
  onlyGroup: true,
  execute: async ({ chat, message }) => {
    await setExitMessage(chat as GroupChat, message);
  },
};
