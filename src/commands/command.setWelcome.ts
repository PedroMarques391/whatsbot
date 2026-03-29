import { setWelcomeMessage } from "@/services";
import { ICommand } from "types";
import { GroupChat } from "whatsapp-web.js";

export const SetWelcomeCommand: ICommand = {
  name: "/setWelcome",
  description: "Define uma mensagem de boas-vindas personalizada para o grupo.",
  sintaxe: "/setWelcome <mensagem>",
  onlyGroup: true,
  execute: async ({ chat, message }) => {
    await setWelcomeMessage(chat as GroupChat, message);
  },
};
