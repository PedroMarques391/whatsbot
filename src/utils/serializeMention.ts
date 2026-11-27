import { Message } from "whatsapp-web.js";
import { SerializedMention } from "../../types";

export class MentionUtils {
  static async serializeMention(message: Message): Promise<SerializedMention> {
    const mentions = await message.getMentions();
    const targetMention = mentions[0];

    return {
      serializedNumber: targetMention.id._serialized,
      user: targetMention.id.user,
    };
  }

  static isBotMentioned(message: Message, botLid: string | null): boolean {
    if (!botLid) return false;

    const mentionedIds = message.mentionedIds ?? [];

    if (mentionedIds.length !== 1) return false;

    return mentionedIds[0] === botLid;
  }
}
