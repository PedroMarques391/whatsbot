import UserModel from "@/models/user";
import { Chat, Message } from "whatsapp-web.js";

export async function registerUser(message: Message, chat: Chat) {
  const contact = await message.getContact();

  const hasUser = await UserModel.findOne({ userId: contact.id._serialized });
  if (hasUser) {
    await chat.sendMessage("> Que legal, você já está registrado!");
    return;
  }
  await UserModel.create({
    userId: contact.id._serialized,
    name: contact.pushname || contact.name || "Usuário sem nome",
    phone: contact.number,
    isBanned: false,
  });
  console.log(
    `[REGISTER] Novo usuário registrado: ${contact.pushname} (${contact.number})`,
  );
  await message.reply(
    "> Parabéns. Você acaba de se tornar um espécime. Seus dados agora me pertencem, e eu nunca esqueço o que aprendo.",
  );
}
