import { Chat, Message } from "whatsapp-web.js";
import { ICommand } from "../../../types";

export async function validateOnlyGroup(command: ICommand, chat: Chat, message: Message): Promise<boolean> {
    if (command.onlyGroup && !chat.isGroup) {
        await message.reply(`O comando *${command.name}* só pode ser usado em grupos.`);
        return true
    }
    return false
}