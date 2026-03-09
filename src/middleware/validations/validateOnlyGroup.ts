import { Chat, Message } from 'whatsapp-web.js';
import { ICommand } from '../../../types';

export async function validateOnlyGroup(command: ICommand, chat: Chat, message: Message): Promise<boolean> {
    if (command.onlyGroup && !chat.isGroup) {
        await message.reply(`Acho que o comando *${command.name}* funciona melhor quando estamos com outras pessoas. Que tal tentarmos em um grupo? ☕`);
        return true;
    }
    return false;
}