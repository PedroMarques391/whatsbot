import { demoteParticipant } from "@/services";
import { ICommand } from "../../types";

export const DemoteCommand: ICommand = {
  name: "/downgrade",
  onlyGroup: true,
  aliases: ["/demote", "/degrade"],
  async execute({ message, chat, client }) {
    await demoteParticipant(message, chat, client);
  },
};
