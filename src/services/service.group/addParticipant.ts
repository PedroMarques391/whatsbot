import { extractTextFromBody } from '@/utils';
import { authorIsAdmin, botIsAdmin, groupParticipants, notAValidNumber } from '@/helpers';
import { GroupChat, Message } from 'whatsapp-web.js';



export async function addParticipant(message: Message, chat: GroupChat | any) {
    const isBotAdmin = await botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await notAValidNumber(message, '/add');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const phoneRegex = /^\d{12,}$/;
    if (phoneRegex.test(extractTextFromBody(message.body))) {
        if (groupParticipants(chat).includes(`${extractTextFromBody(message.body)}@c.us`)) {
            return message.reply(`O número ${extractTextFromBody(message.body)} já está no grupo. 😚`);
        }
        return chat.addParticipants([`${extractTextFromBody(message.body)}@c.us`]);
    }
    await message.reply('O número de telefone que você digitou não parece ser válido. Por favor, verifique e tente novamente.');
}