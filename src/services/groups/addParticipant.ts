import WAWebJS, { GroupChat, Message } from "whatsapp-web.js";
import { helpers, groups } from "../../utils/";


export async function addParticipant(message: Message, chat: GroupChat | any) {
    const isBotAdmin = await groups.botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await helpers.isNotAValidNumber(message, '/add');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await groups.authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const phoneRegex = /^\d{12,}$/;
    if (phoneRegex.test(helpers.extractTextFromBody(message.body))) {
        if (helpers.groupParticipants(chat).includes(`${helpers.extractTextFromBody(message.body)}@c.us`)) {
            return message.reply(`O número ${helpers.extractTextFromBody(message.body)} já está no grupo. 😚`);
        }
        return chat.addParticipants([`${helpers.extractTextFromBody(message.body)}@c.us`]);
    }
    await message.reply('O número de telefone que você digitou não parece ser válido. Por favor, verifique e tente novamente.');
}