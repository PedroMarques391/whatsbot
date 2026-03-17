import { extractTextFromBody } from "@/utils";
import { Client, GroupChat, Message } from "whatsapp-web.js";
import { groupParticipants } from "../group/groupParticipants";

/**
 * Determines whether a user is not part of the group participants list.
 * @param chat - The group chat to check.
 * @param message - The message containing the user information.
 * @param client - The WhatsApp client instance to fetch contact information.
 * @returns {boolean} True if the user is in the group.
 * @throws {Error} If the user is not in the group.
 */
export async function isUserNotInGroup(
  chat: GroupChat,
  message: Message,
  client: Client,
): Promise<boolean> {
  const getNumberOrId = extractTextFromBody(message.body);
  const contactId = getNumberOrId.includes("@")
    ? getNumberOrId.split("@")[1] + "@lid"
    : `${getNumberOrId}@c.us`;

  const getContactById = await client.getContactById(contactId);

  if (!groupParticipants(chat).includes(getContactById.id._serialized)) {
    throw new Error(
      `Acho que você se confundiu. O número "${getContactById.id.user}" não consta na nossa lista de participantes deste grupo.`,
    );
  }
  return false;
}
