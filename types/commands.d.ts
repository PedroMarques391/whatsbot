import { Chat, Client, GroupChat, Message } from "whatsapp-web.js";

export interface BotContext {
  chat: Chat | GroupChat;
  client: Client;
  message: Message;
}

export interface ICommand {
  name: string;
  description: string;
  sintaxe?: string;
  aliases?: string[];
  onlyGroup?: boolean;
  conditions?: (context: BotContext) => boolean | Promise<boolean>;
  execute(context: BotContext): Promise<void>;
}
