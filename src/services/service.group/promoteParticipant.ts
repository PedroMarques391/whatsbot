import { authorIsAdmin, botIsAdmin, getGroupAdmins, isNotInGroup, notAValidNumber } from '@/helpers';
import { extractTextFromBody } from '@/utils';
import { Client, GroupChat, Message } from 'whatsapp-web.js';


export async function promoteParticipant(message: Message, chat: GroupChat | any, client: Client) {
    const isBotAdmin = await botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await notAValidNumber(message, '/promote');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const userPromove = await isNotInGroup(chat, message);
    if (userPromove) {
        return;
    }
    if (getGroupAdmins(chat).includes(`${extractTextFromBody(message.body)}@c.us`)) {
        return message.reply('O membro que você deseja promover já é um administrador. 🙁');
    }
    await chat.promoteParticipants([`${extractTextFromBody(message.body)}@c.us`]);
    await client.sendMessage(chat.id._serialized, `Parabéns @${extractTextFromBody(message.body)}, você foi promovido a administrador do grupo. Contamos com você! 😄🥳🎉`, { mentions: [`${extractTextFromBody(message.body)}@c.us`] });
}
