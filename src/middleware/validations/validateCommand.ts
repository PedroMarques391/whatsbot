import { Message } from "whatsapp-web.js";

export async function validateCommand(message: Message): Promise<boolean> {
    if (message.body.trim().startsWith('/')) {
        await message.reply(
            `🌸 *opsiee~ Comando desconhecido:* \`${message.body.split(' ')[0]}\` 🌸\n` +
            `Usa */start* para ver todos os comandos fofinhos disponíveis! 🐾`
        );
        return true
    }
    return false
}