import { unblockCommand } from "@/services";
import { ICommand } from "types";

export const UnblockCommand: ICommand = {
  name: "/unblock",
  onlyGroup: true,
  async execute({ chat, message }) {
    await unblockCommand(message, chat);
  },
};
