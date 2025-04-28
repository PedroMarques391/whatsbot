import { Chat, Client, Message } from "whatsapp-web.js";
import { commandHandler } from "../commands";
import { interactionsHandler, validateCommand, validatorsHandler } from "../middleware";

export async function onMessageCreate(client: Client, message: Message) {
    const chat: Chat = await message.getChat();
    const quotedMessage = await message.getQuotedMessage();
    const command = await commandHandler(message.body);

    if (await interactionsHandler(message, quotedMessage, chat, client)) return

    if (!command) {
        await validateCommand(message)
        return true
    }

    if (await validatorsHandler(command, message, chat, client)) return

    try {
        await command.execute({ chat, client, message });
    } catch (error) {
        console.error(`Erro ao executar ${command.name}:`, error);
        await message.reply('🌸 Opsie~ Algo deu errado! Tenta de novo ou avisa meu dev! 🐾');
    }
}