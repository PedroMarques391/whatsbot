import { getAIService } from "@/factories";
import { ICommand } from "../../types";

const aiService = getAIService();

export const ResumeCommand: ICommand = {
  name: "/resume",
  description: "Retorna o resumo das últimas 500 mensagens do chat.",
  onlyGroup: false,
  aliases: ["/rsm", "/rs"],
  async execute({ client, message }) {
    await aiService.resumeMessages(client, message);
  },
};
