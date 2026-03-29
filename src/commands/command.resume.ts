import { resumeMessages } from "@/services";
import { ICommand } from "../../types";

export const ResumeCommand: ICommand = {
  name: "/resume",
  description: "Retorna o resumo das últimas 500 mensagens do chat.",
  onlyGroup: false,
  aliases: ["/rsm", "/rs"],
  async execute({ client, message }) {
    await resumeMessages(client, message);
  },
};
