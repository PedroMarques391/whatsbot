import { authorIsAdmin, botIsAdmin, getGroupAdmins, isAuthorOrBot, isNotInGroup, notAValidNumber } from '@/helpers';
import { extractTextFromBody } from '@/utils';
import { Client, GroupChat, Message } from 'whatsapp-web.js';



export async function demoteParticipant(message: Message, chat: GroupChat | any, client: Client) {
    const isBotAdmin = await botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await notAValidNumber(message, '/demote');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const userToDemote = await isNotInGroup(chat, message);
    if (userToDemote) {
        return;
    }

    if (!getGroupAdmins(chat).includes(`${extractTextFromBody(message.body)}@c.us`)) {
        return message.reply('Este participante já está sem os privilégios de administração. Que tal focarmos em quem realmente está no comando? ✨');
    }
    if (isAuthorOrBot(message)) {
        return message.reply('Admiro a iniciativa, mas não podemos alterar a nossa própria hierarquia — muito menos a minha. Vamos manter as coisas como estão. ☕');
    }
    await chat.demoteParticipants([`${extractTextFromBody(message.body)}@c.us`]);
    await client.sendMessage(chat.id._serialized, `Tudo resolvido. @${extractTextFromBody(message.body)} teve seus privilégios revogados com sucesso. Gosto de tudo bem organizado. ✨`, { mentions: [`${extractTextFromBody(message.body)}@c.us`] });
}