import GroupModel from "@/models/group";
import { Client, GroupChat, GroupNotification } from "whatsapp-web.js";

export async function join(notification: GroupNotification, client: Client) {
  const { recipientIds, chatId } = notification;

  try {
    const newMemberId = recipientIds[recipientIds.length - 1];
    const mention = newMemberId.split("@")[0];
    const group = (await notification.getChat()) as GroupChat;

    if (newMemberId === process.env.RECIPIENT_ID) {
      const isRegistered = await GroupModel.findOne({
        groupId: group.id._serialized,
      });

      if (!isRegistered) {
        await GroupModel.create({
          groupId: group.id._serialized,
          name: group.name,
          description: group.description || "",
          members: group.groupMetadata.participants.map(
            (p) => p.id._serialized,
          ),
          blockedCommands: [],
        });
        await client.sendMessage(
          chatId,
          "As informações do grupo foram registradas com sucesso no banco de dados!.",
        );
        return;
      }

      await client.sendMessage(
        chatId,
        "Olá a todos. Sou Ada, e a partir de agora auxiliarei na organização e dinâmicas deste grupo. Envie /start para conhecer minhas funcionalidades ou /info para saber mais sobre mim!",
      );

      return;
    }
    await client.sendMessage(
      chatId,
      `Seja bem-vindo(a) ao grupo, @${mention}. Eu me chamo Ada, e estou à disposição para facilitar nossas interações. Sinta-se à vontade para explorar minhas funcionalidades com o comando /start. ☕`,
      { mentions: [newMemberId] },
    );
    return;
  } catch (error) {
    console.error("Erro ao enviar mensagem de boas-vindas:", error);
  }
}
