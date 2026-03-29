import { help } from "@/services";
import { ICommand } from "types";

export const HelpCommand: ICommand = {
  name: "/help",
  aliases: ["/ajuda", "/h"],
  description:
    "Mostra o jeito correto de usar os comandos e suas funcionalidades.",
  sintaxe: "/help <comando>",
  onlyGroup: false,
  async execute({ message }) {
    await help(message);
  },
};
