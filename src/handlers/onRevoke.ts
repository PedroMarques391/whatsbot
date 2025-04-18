import { Message } from "whatsapp-web.js";
import { CLIENT_NUMBER } from "../config/env";


export async function onRevoke(message: Message, messageRevoke: any) {
    if (!message.hasMedia && messageRevoke) {
        await messageRevoke.reply(`O usuário ${message.author || 'Desconhecido'} apagou a mensagem "${messageRevoke.body}".`, CLIENT_NUMBER);
    }
}