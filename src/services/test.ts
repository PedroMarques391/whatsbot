import { extractTextFromBody } from "../utils/helpers"
import { Chat, Client, Message } from "whatsapp-web.js";

export async function textFunction(message: Message, chat: Chat, client: Client) {
    await message.reply("epaa, não estou com nenhuma função teste ativa. 😑")
        .then(async (message) => await message.react("🌸"))
    await message.react("✅")

}