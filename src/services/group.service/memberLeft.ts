import { Client, GroupNotification } from "whatsapp-web.js";

export async function leave(notification: GroupNotification, client: Client) {
  const { chatId, recipientIds } = notification;

  try {
    const participantId = recipientIds[recipientIds.length - 1];

    if (participantId === process.env.RECIPIENT_ID) return;

    const contact = await client.getContactById(participantId);
    const name = contact.pushname || contact.name || "Alguém";

    await client.sendMessage(
      chatId,
      `${name} acabou de deixar o grupo. Provavelmente ele odeia vocês.`,
    );
  } catch (error) {
    console.error("Erro ao enviar mensagem de saída:", error);
  }
}
