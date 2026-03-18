import { serializeMention } from "@/utils";
import { GroupChat, Message } from "whatsapp-web.js";

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
): Promise<boolean> {
  const { serializedNumber } = await serializeMention(message);

  const isParticipant = chat.participants.some(
    (participant) => participant.id._serialized === serializedNumber,
  );

  if (!isParticipant) {
    throw new Error(
      `Acho que você se confundiu. O usuário mencionado não consta na nossa lista de participantes.`,
    );
  }
  return false;
}
