import { registerUser } from "@/services";
import { ICommand } from "../../types";

export const RegisterCommand: ICommand = {
  name: "/register",
  onlyGroup: false,
  aliases: ["/reg", "/registrar"],
  async execute({ client, message, chat }) {
    await registerUser(message, client, chat);
  },
};
