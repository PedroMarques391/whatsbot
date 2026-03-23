import { Message } from "whatsapp-web.js";

export async function onRevoke(
  message: Message,
  messageRevoke: Message | null | undefined,
) {
  const contact = await message.getContact();

  if (!messageRevoke) return;

  if (!message.hasMedia && messageRevoke) {
    await messageRevoke.reply(
      `O usuário ${contact.pushname || "Desconhecido"} / ${contact.number} apagou a mensagem "${messageRevoke.body}".`,
      process.env.CLIENT_NUMBER,
    );
    return;
  }
  await messageRevoke.reply(
    `O usuário ${contact.pushname || "Desconhecido"} / ${contact.number} apagou a mensagem "${messageRevoke.body}".`,
    process.env.CLIENT_NUMBER,
  );
}
