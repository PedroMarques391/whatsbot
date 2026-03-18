import { Message } from "whatsapp-web.js";

export function isAuthorOrBot(message: Message): boolean {
  const metionedNumber = message.mentionedIds[0];
  return (
    metionedNumber === message.author ||
    metionedNumber === process.env.RECIPIENT_ID
  );
}
