import { Chat, Client, Message } from "whatsapp-web.js";

export async function textFunction(message: Message, chat: Chat, client: Client) {
    console.log("chamando text")
}