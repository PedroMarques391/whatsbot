import { AIFactory } from "@/factories";
import { ICommand } from "../../types";

export const TalkCommand: ICommand = {
  name: "ada",
  description: "Inicia uma conversa genérica com a IA",
  sintaxe: "ada <mensagem>",
  onlyGroup: false,
  aliases: ["ada,", "adabot,"],
  async execute({ message }) {
    const aiService = AIFactory.getAiService();
    await aiService.response(message, 1, 200);
  },
};
