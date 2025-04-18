import { Message } from "whatsapp-web.js";
import { geminiChat } from "../../services/ai";



/**
 * Handles user replies to messages previously sent by the bot.
 * If the user replies to a non-media message from the bot (not using a command),
 * this function will process the conversation and generate a response using Gemini.
 * @param message - The incoming message from the user.
 * @param quotedMessage - The quoted message the user replied to.
 * @returns {boolean} A boolean indicating whether the interaction was handled.
 */
export async function quotedReply(message: Message, quotedMessage: Message): Promise<boolean> {

    if (message.fromMe ||
        !message.hasQuotedMsg ||
        message.body.trim().startsWith("/")) return false

    if (quotedMessage.id.fromMe && !quotedMessage.hasMedia) {
        console.log('Ada disse:', quotedMessage.body);
        console.log('Usuário respondeu:', message.body);
        const response = await geminiChat(message.body, quotedMessage.body);
        await message.reply(response);
        return true
    }
    return false
}




