import { registerUser } from "@/services";
import { ICommand } from "../../types";

export const RegisterCommand: ICommand = {
  name: "/register",
  description: "Registra o usuário no banco de dados do bot",
  onlyGroup: false,
  aliases: ["/reg", "/registrar"],
  async execute({ client, message, chat }) {
    await registerUser(message, client, chat);
  },
};
