import { extractTextFromBody } from '@/utils';
import { Message } from 'whatsapp-web.js';

export async function notAValidNumber(message: Message, command: string): Promise<boolean> {
    if (extractTextFromBody(message.body) === '' || extractTextFromBody(message.body).match(/[+\-()]/)) {
        await message.reply(`Por favor, adicione um número após '${command}' sem caracteres especiais. \nPor exemplo, use '${command} 551188889999'.`);
        return true;
    }
    return false;
}