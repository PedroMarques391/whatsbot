import { authorIsAdmin, botIsAdmin, groupParticipants, notAValidNumber } from '@/helpers';
import { extractTextFromBody } from '@/utils';
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
            return message.reply(`Noto que esta pessoa já faz parte do nosso grupo. Não precisamos de convites duplicados, certo? ✨`);
        }
        return chat.addParticipants([`${extractTextFromBody(message.body)}@c.us`]);
    }
    await message.reply('O número que você me enviou parece ter algum detalhe incorreto. Dê uma olhadinha no formato e tentaremos de novo. ☕');
}