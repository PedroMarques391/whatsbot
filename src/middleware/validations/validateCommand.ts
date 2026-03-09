import { Message } from 'whatsapp-web.js';

export async function validateCommand(message: Message): Promise<boolean> {
    if (message.body.trim().startsWith('/')) {
        await message.reply(
            `Acho que você se confundiu. O comando \`${message.body.split(' ')[0]}\` não faz parte do meu repertório. ✨\n` +
            'Use */start* caso queira relembrar o que posso fazer por você.'
        );
        return true;
    }
    return false;
}