import { blockCommand } from "@/services";
import { ICommand } from "types";

export const BlockCommand: ICommand = {
  name: "/block",
  onlyGroup: true,
  async execute({ chat, message }) {
    await blockCommand(message, chat);
  },
};
