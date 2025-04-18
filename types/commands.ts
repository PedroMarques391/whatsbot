import { Message, Chat, Client, GroupChat } from "whatsapp-web.js";

export interface BotContext {
    chat: Chat
    client: Client
    message: Message
}

export interface ICommand {
    name: string
    aliases?: string[]
    onlyGroup?: boolean;
    conditions?: (context: BotContext) => boolean | Promise<boolean>;
    execute(context: BotContext): Promise<void>;
}