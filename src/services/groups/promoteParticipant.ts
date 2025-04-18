import WAWebJS, { Client, GroupChat, Message } from "whatsapp-web.js";
import { groups, helpers } from "../../utils";


export async function promoteParticipant(message: Message, chat: GroupChat | any, client: Client) {
    const isBotAdmin = await groups.botIsAdmin(chat, message);
    if (!isBotAdmin) {
        return;
    }
    const notValid = await helpers.isNotAValidNumber(message, '/promote');
    if (notValid) {
        return;
    }
    const messageAuthorIsAdmin = await groups.authorIsAdmin(chat, message);
    if (!messageAuthorIsAdmin) {
        return;
    }
    const userPromove = await groups.isNotInGroup(chat, message);
    if (userPromove) {
        return;
    }
    if (groups.getGroupAdmins(chat).includes(`${helpers.extractTextFromBody(message.body)}@c.us`)) {
        return message.reply('O membro que você deseja promover já é um administrador. 🙁');
    }
    await chat.promoteParticipants([`${helpers.extractTextFromBody(message.body)}@c.us`]);
    await client.sendMessage(chat.id._serialized, `Parabéns @${helpers.extractTextFromBody(message.body)}, você foi promovido a administrador do grupo. Contamos com você! 😄🥳🎉`, { mentions: [`${helpers.extractTextFromBody(message.body)}@c.us`] });
}
