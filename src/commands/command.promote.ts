import { promoteParticipant } from "@/services";
import { GroupChat } from "whatsapp-web.js";
import { ICommand } from "../../types";

export const PromoteCommand: ICommand = {
  name: "/upgrade",
  description: "Dá poder de administrador a um participante",
  sintaxe: "/upgrade @user",
  onlyGroup: true,
  aliases: ["/promote", "/elevate"],
  async execute({ message, chat, client }) {
    await promoteParticipant(message, chat as GroupChat, client);
  },
};
