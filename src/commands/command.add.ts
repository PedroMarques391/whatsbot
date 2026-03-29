import { addParticipant } from "@/services";
import { GroupChat } from "whatsapp-web.js";
import { ICommand } from "../../types";

export const AddCommand: ICommand = {
  name: "/add",
  description: "Adiciona um participante ao grupo",
  sintaxe: "/add <numero>",
  onlyGroup: true,
  async execute({ message, chat }) {
    await addParticipant(message, chat as GroupChat);
  },
};
