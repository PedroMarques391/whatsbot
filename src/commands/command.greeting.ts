import { greeting } from "@/middleware/interactions/onGreeting";
import { ICommand } from "../../types";

export const GreetingCommand: ICommand = {
  name: "ada",
  aliases: ["adabot", `@${process.env.CLIENT_NUMBER.split("@")[0]}`],
  conditions: ({ message }) => !message.fromMe,
  async execute({ message, chat }) {
    await greeting(message, chat);
  },
};
