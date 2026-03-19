import { GroupChat } from "whatsapp-web.js";
import personality from "../../model/PERSONALITY.json";
import { ICommand } from "../../types";

export const InfoCommand: ICommand = {
  name: "/info",
  onlyGroup: false,
  async execute({ message, chat, client }) {
    const isGroup = chat.isGroup;
    const allChats: GroupChat[] = (await client.getChats()) as GroupChat[];
    const groups: GroupChat[] = allChats.filter(
      (c) => c.isGroup && !(c as GroupChat).groupMetadata.isParentGroup,
    );

    let groupInfo = "";

    if (isGroup) {
      const groupChat = chat as GroupChat;
      groupInfo = `\n*Grupo Atual:* ${groupChat.name}`;
    }

    const infoMessage = `*Informações do Bot - ${personality.personality_prompt.meta.identity}*\n
*Versão do Bot:* 2.0
*Criador:* ${personality.personality_prompt.meta.creator}
*GitHub:* ${personality.personality_prompt.meta.creator_github}
*Repositório:* ${personality.personality_prompt.meta.repo}${groupInfo}
*Total de Grupos:* ${groups.length}
✨ _${personality.personality_prompt.psychology.self_perception}_\n`;

    await message.reply(infoMessage, chat.id._serialized, {
      linkPreview: true,
    });
  },
};
