import { listMembers } from "@/services";
import { GroupChat } from "whatsapp-web.js";
import { ICommand } from "../../types/commands";

export const ListCommand: ICommand = {
  name: "/list",
  description: "Lista todos os participantes do grupo",
  onlyGroup: true,
  async execute({ chat, message }) {
    return listMembers(chat as GroupChat, message);
  },
};
