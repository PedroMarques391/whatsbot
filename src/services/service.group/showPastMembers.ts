import { GroupChat } from 'whatsapp-web.js';

export async function showPastMembers(chat: GroupChat): Promise<void> {
    const pastParticipants = await chat.pastParticipants;

    if (!pastParticipants || pastParticipants.length === 0) {
        await chat.sendMessage('Fiz uma varredura cuidadosa, mas não encontrei registros de membros antigos. Parece que todos decidiram ficar. ✨');
        return;
    }

    let message = '📜 *Participantes anteriores do grupo:*\n';

    pastParticipants.forEach((participant: any) => {
        const exit = new Date(participant.leaveTimestamp * 1000);
        const day = exit.getDate().toString().padStart(2, '0');
        const month = (exit.getMonth() + 1).toString().padStart(2, '0');
        const year = exit.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        message += `\n📱 Número: ${participant.id.user}\n📅 Saiu em: ${formattedDate}\n📤 Motivo: ${participant.leaveReason ?? 'Desconhecido'}\n─────────────`;
    });

    await chat.sendMessage(message);
} 