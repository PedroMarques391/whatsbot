import { unblockCommand } from "@/services";
import { ICommand } from "types";

export const UnblockCommand: ICommand = {
  name: "/unblock",
  description: "Desbloqueia o uso de um comando no grupo",
  sintaxe: "/unblock <comando>",
  onlyGroup: true,
  async execute({ chat, message }) {
    await unblockCommand(message, chat);
  },
};
