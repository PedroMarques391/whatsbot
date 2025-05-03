import { Chat, Client, Message } from 'whatsapp-web.js';
import { ICommand } from '../../../types';

export function validateConditions(command: ICommand, message: Message, chat: Chat, client: Client): boolean {
    if (command.conditions && !command.conditions({ message, chat, client })) {
        console.log(`Comando ${command.name} ignorado por não cumprir condição`);
        return true;
    }
    return false;
}