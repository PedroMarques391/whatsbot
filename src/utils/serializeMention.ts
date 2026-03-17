import { Message } from "whatsapp-web.js";

type SerializedMention = {
  serializedNumber: string;
  user: string;
};

async function serializeMention(message: Message): Promise<SerializedMention> {
  const mentions = await message.getMentions();
  const targetMention = mentions[0];

  return {
    serializedNumber: targetMention.id._serialized,
    user: targetMention.id.user,
  };
}

export { serializeMention };
