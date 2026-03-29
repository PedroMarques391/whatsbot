import { sendUpdateMessages } from "@/helpers";
import { ICommand } from "../../types";

export const SendUpdateCommand: ICommand = {
  name: "/sendUpdate",
  description: "Envia uma mensagem de atualização para todos os grupos",
  sintaxe: "/sendUpdate <mensagem>",
  onlyGroup: false,
  conditions: ({ message }) => message.fromMe,
  async execute({ client, message }) {
    await sendUpdateMessages(client, message);
  },
};
