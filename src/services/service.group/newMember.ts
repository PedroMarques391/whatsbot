import { Client, GroupNotification } from 'whatsapp-web.js';


export async function join(notification: GroupNotification, client: Client) {
    const { recipientIds, chatId } = notification;
    try {
        const newMemberId = recipientIds[recipientIds.length - 1];
        const mention = newMemberId.split('@')[0];

        if (newMemberId === client.info.wid._serialized) {
            await client.sendMessage(
                chatId,
                '🌸✨ Olá, pessoal! Eu sou a *AdaBot*, estou aqui para ajudar e deixar tudo mais divertido! 💖 Digite "/start" para ver o que posso fazer. 😊',
            );
        }
        if (newMemberId !== client.info.wid._serialized) {
            await client.sendMessage(
                chatId,
                `🌸✨ Olá, @${mention}! Seja muito bem-vindo(a) ao grupo! ✨🌸 Eu sou a *AdaBot*, estou aqui para ajudar e deixar tudo mais divertido! 💖 Digite "/start" para ver todos os comandos disponíveis e aproveitar ao máximo! 😊`,
                { mentions: [newMemberId] },
            );
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem de boas-vindas:', error);
    }
}