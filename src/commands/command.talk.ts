import { getAIService } from "@/factories";
import { ICommand } from "../../types";

const aiService = getAIService();

export const TalkCommand: ICommand = {
  name: "ada",
  description: "Inicia uma conversa genérica com a IA",
  sintaxe: "ada <mensagem>",
  onlyGroup: false,
  aliases: ["ada,", "adabot,"],
  async execute({ message }) {
    await aiService.response(message, 1, 200);
  },
};
