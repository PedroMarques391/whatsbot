import { demoteParticipant } from "@/services";
import { ICommand } from "../../types";

export const DemoteCommand: ICommand = {
  name: "/downgrade",
  description: "Remove poder de administrador de um participante",
  sintaxe: "/downgrade @user",
  onlyGroup: true,
  aliases: ["/demote", "/degrade"],
  async execute({ message, chat, client }) {
    await demoteParticipant(message, chat, client);
  },
};
