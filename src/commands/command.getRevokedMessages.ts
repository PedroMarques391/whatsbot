import { getRevokedMessages } from "@/services";
import { ICommand } from "types";

export const GetRevokedMessagesCommand: ICommand = {
  name: "/getRevoked",
  description: "Recupera que o usuário apagou no grupo atual.",
  sintaxe: "/getRevoked @user",
  onlyGroup: true,
  aliases: ["/grm", "/getDeleted", "/gd"],
  async execute({ message, chat, client }) {
    await getRevokedMessages(message, chat, client);
  },
};
