import { ICommand } from "types";

export const SetExitMessageCommand: ICommand = {
  name: "/setExit",
  description: "Define uma mensagem de saída personalizada para o grupo.",
  sintaxe: "/setExit <mensagem>",
  onlyGroup: true,
  execute: async ({ chat, message }) => {},
};
