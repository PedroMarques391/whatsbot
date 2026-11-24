import { Chat, Message } from 'whatsapp-web.js';
import { ICommand } from '../../../types';

export async function validateOnlyGroup(command: ICommand, chat: Chat, message: Message): Promise<boolean> {
    if (command.onlyGroup && !chat.isGroup) {
        await message.reply(`O comando *${command.name}* só funciona em grupos. Tentar no privado não vai mudar isso.`);
        return true;
    }
    return false;
}