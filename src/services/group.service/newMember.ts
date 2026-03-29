import GroupModel from "@/models/group";
import { Contact, GroupChat, GroupNotification } from "whatsapp-web.js";

export async function join(notification: GroupNotification) {
  const { recipientIds, chatId } = notification;

  try {
    const getRecipients = await notification.getRecipients();
    const contact = getRecipients[getRecipients.length - 1] as Contact;
    const newMemberId = recipientIds[recipientIds.length - 1];
    const mention = newMemberId.split("@")[0];

    if (newMemberId === process.env.RECIPIENT_ID) {
      const group = (await notification.getChat()) as GroupChat;
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
      }

      await notification.reply(
        "Olá a todos. Sou Ada, e a partir de agora auxiliarei na organização e dinâmicas deste grupo. Envie /start para conhecer minhas funcionalidades ou /info para saber mais sobre mim!",
      );

      return;
    }
    const result = await GroupModel.findOneAndUpdate(
      { groupId: chatId },
      { $addToSet: { members: contact.id._serialized } },
      {
        projection: { blockedCommands: 1, welcomeMessage: 1 },
        returnDocument: "before",
        lean: true,
      },
    );

    if (!result) {
      console.warn(
        `[warn] Grupo ${chatId} não encontrado no banco de dados ao adicionar novo membro.`,
      );
      return;
    }

    const blocked = result.blockedCommands || [];
    const customWelcome = result.welcomeMessage;

    let messageBody = `Olá, seja bem-vindo(a) @${mention}! Eu sou a Ada.`;

    messageBody += `\nUse */start* para me conhecer ou */register* para se registrar.`;

    if (customWelcome) {
      messageBody += `\n\n*Mensagem do Grupo:*\n${customWelcome}`;
    }

    if (blocked.length > 0) {
      messageBody += `\n\n>*Comandos Proibidos Nesse grupo:* ${blocked.join(", ")}`;
    }

    await notification.reply(messageBody, {
      mentions: [newMemberId],
    });

    return;
  } catch (error) {
    console.error("Erro ao enviar mensagem de boas-vindas:", error);
  }
}
