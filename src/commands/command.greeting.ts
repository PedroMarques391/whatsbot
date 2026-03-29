import { greeting } from "@/middleware/interactions/onGreeting";
import { ICommand } from "../../types";

export const GreetingCommand: ICommand = {
  name: "ada",
  description: "Inicia uma interação de saudação com o bot",
  aliases: ["adabot", `@${process.env.CLIENT_NUMBER.split("@")[0]}`],
  conditions: ({ message }) => !message.fromMe,
  async execute({ message, chat }) {
    await greeting(message, chat);
  },
};
