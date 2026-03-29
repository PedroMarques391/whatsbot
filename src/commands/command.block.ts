import { blockCommand } from "@/services";
import { ICommand } from "types";

export const BlockCommand: ICommand = {
  name: "/block",
  description: "Bloqueia o uso de um comando no grupo",
  sintaxe: "/block <comando>",
  onlyGroup: true,
  async execute({ chat, message }) {
    await blockCommand(message, chat);
  },
};
