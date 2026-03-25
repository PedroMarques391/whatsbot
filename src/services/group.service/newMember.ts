import GroupModel from "@/models/group";
import { Client, GroupChat, GroupNotification } from "whatsapp-web.js";

export async function join(notification: GroupNotification, client: Client) {
  const { recipientIds, chatId } = notification;

  try {
    const newMemberId = recipientIds[recipientIds.length - 1];
    const mention = newMemberId.split("@")[0];
    const group = (await notification.getChat()) as GroupChat;
    const contact = await client.getContactById(newMemberId);

    if (newMemberId === process.env.RECIPIENT_ID) {
      const result = await GroupModel.findOneAndUpdate(
        { groupId: chatId },
        {
          $setOnInsert: {
            name: group.name,
            description: group.description || "",
            members: group.groupMetadata.participants.map(
              (p) => p.id._serialized,
            ),
            blockedCommands: [],
          },
        },
        {
          upsert: true,
          returnDocument: "before",
          includeResultMetadata: true,
        },
      );

      if (!result?.lastErrorObject?.updatedExisting) {
        console.log(
          `[REGISTER] Grupo ${group.name} adicionado ao banco de dados.`,
        );
        await client.sendMessage(chatId, "Grupo registrado com sucesso!");
      }

      await client.sendMessage(
        chatId,
        "Olá a todos. Sou Ada, e a partir de agora auxiliarei na organização e dinâmicas deste grupo. Envie /start para conhecer minhas funcionalidades ou /info para saber mais sobre mim!",
      );

      return;
    }
    const result = await GroupModel.findOneAndUpdate(
      { groupId: chatId },
      { $addToSet: { members: contact.id._serialized } },
      {
        projection: { blockedCommands: 1 },
        returnDocument: "before",
        lean: true,
      },
    );

    const blocked = result?.blockedCommands || [];

    const blockedMsg =
      blocked.length > 0
        ? `\n\n*[Comando bloqueados]* Os seguintes comandos estão proibidos nesse grupo: ${blocked.join(", ")}.`
        : "";
    await client.sendMessage(
      chatId,
      `Seja bem-vindo(a) ao grupo, @${mention}. Eu me chamo Ada, e estou à disposição para facilitar nossas interações. Sinta-se à vontade para explorar minhas funcionalidades com o comando */start* e aproveite para se registrar usando o comando */register*!${blockedMsg}`,
      { mentions: [newMemberId] },
    );
    return;
  } catch (error) {
    console.error("Erro ao enviar mensagem de boas-vindas:", error);
  }
}
