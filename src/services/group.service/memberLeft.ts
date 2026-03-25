import GroupModel from "@/models/group";
import console from "console";
import { Contact, GroupNotification } from "whatsapp-web.js";

export async function leave(notification: GroupNotification) {
  const { chatId, recipientIds, type } = notification;
  const recipentsIds = await notification.getRecipients();
  const contact = recipentsIds[recipentsIds.length - 1] as Contact;
  const whoRemoved = await notification.getContact();

  console.log(whoRemoved);
  try {
    const participantId = recipientIds[recipientIds.length - 1];
    const updateUsersList = await GroupModel.findOneAndUpdate(
      { groupId: chatId },
      { $pull: { members: contact.id._serialized } },
      {
        projection: { members: 1 },
        returnDocument: "after",
        lean: true,
      },
    );

    if (participantId === process.env.RECIPIENT_ID || !updateUsersList) return;

    const name = contact.pushname || contact.name || "Alguém";
    const response =
      type === "remove"
        ? `${name} foi expulso do grupo por ${whoRemoved.pushname}. Acho que mexeu com quem não devia.`
        : `${name} saiu do grupo, provavelmente vocês são odiados.`;

    await notification.reply(response);
  } catch (error) {
    console.error("Erro ao enviar mensagem de saída:", error);
  }
}
