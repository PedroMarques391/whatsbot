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
}
