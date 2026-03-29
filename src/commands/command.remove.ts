import { removeParticipant } from "@/services";
import { GroupChat } from "whatsapp-web.js";
import { ICommand } from "../../types";

export const RemoveCommand: ICommand = {
  name: "/ban",
  description: "Remove um participante do grupo",
  sintaxe: "/ban <numero>",
  onlyGroup: true,
  aliases: ["/remove", "/rmv", "/rm"],
  async execute({ message, chat }) {
    await removeParticipant(message, chat as GroupChat);
  },
};
