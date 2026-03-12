import { GroupChat, Message } from "whatsapp-web.js";
import { getGroupAdmins } from "../group/groupAdmins";

/**
 * Checks whether the author of the message is an administrator in the group.
 * @param chat - The group chat where the message was sent.
 * @param message - The message whose author will be checked.
 * @returns {boolean} A promise that resolves to true if the author is an admin.
 * @throws {Error} If the author is not an admin.
 */
export async function authorIsAdmin(
  chat: GroupChat,
  message: Message,
): Promise<boolean> {
  const contact = await message.getContact();

  console.log(contact);
  console.log(getGroupAdmins(chat).includes(contact.id._serialized));

  if (
    !contact.id._serialized ||
    !getGroupAdmins(chat).includes(contact.id._serialized)
  ) {
    throw new Error(
      "Sinto muito, mas essa ação requer privilégios de administração. Se desejar, fale com quem está no comando. ☕",
    );
  }
  return true;
}
