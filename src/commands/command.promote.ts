import { promoteParticipant } from "@/services";
import { GroupChat } from "whatsapp-web.js";
import { ICommand } from "../../types";

export const PromoteCommand: ICommand = {
  name: "/upgrade",
  onlyGroup: true,
  aliases: ["/promote", "/elevate"],
  async execute({ message, chat, client }) {
    await promoteParticipant(message, chat as GroupChat, client);
  },
};
