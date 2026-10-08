import { AIFactory } from "@/factories";
import { ICommand } from "../../types";

export const ResumeCommand: ICommand = {
  name: "/resume",
  description: "Retorna o resumo das últimas 500 mensagens do chat.",
  onlyGroup: false,
  aliases: ["/rsm", "/rs"],
  async execute({ client, message }) {
    const aiService = AIFactory.getAiService();
    await aiService.resumeMessages(client, message);
  },
};
