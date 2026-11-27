import { MentionUtils, MessageUtils } from "@/utils";
import { Chat, Client, Message } from "whatsapp-web.js";

const greetingRegexGroup =
  /\b(o{1,}i+|ol+[áa]+|o{2,}p+a+|e+\s*a+[íi]+|f+a+l+a+|s+a+l+v+e+|b+o+m+\s*d+i+a+|b+o+a+\s*t+a+r+d+e+|b+o+a+\s*n+o+i+t+e+|h+e+y+|h+i+|h+e+l+l+o+|y+o+|e+a+e+|e+a+i+|o+i+e+|o+e{2,})\s*(ada|adabot)\b/i;

const greetingRegexPrivate =
  /\b(o{1,}i+|ol+[áa]+|o{2,}p+a+|e+\s*a+[íi]+|f+a+l+a+|s+a+l+v+e+|b+o+m+\s*d+i+a+|b+o+a+\s*t+a+r+d+e+|b+o+a+\s*n+o+i+t+e+|h+e+y+|h+i+|h+e+l+l+o+|y+o+|e+a+e+|e+a+i+|o+i+e+|o+e{2,})\b/i;

const botAliases = ["ada", "adabot", "adinha"];

let cachedBotLid: string | null = null;

function matchesGreetingPattern(body: string, isGroup: boolean): boolean {
  if (isGroup) {
    return greetingRegexGroup.test(body);
  }
  return greetingRegexPrivate.test(body);
}

async function resolveBotLid(
  client: Client,
  waid: string,
): Promise<string | null> {
  if (cachedBotLid) return cachedBotLid;

  const userId = waid ?? process.env.CLIENT_NUMBER?.trim();
  if (!userId) return null;

  const result = await client.getContactLidAndPhone([userId]).catch(() => []);
  cachedBotLid = result[0]?.lid ?? null;
  return cachedBotLid;
}

export async function greeting(
  message: Message,
  chat: Chat,
  client: Client,
): Promise<boolean> {
  if (message.fromMe) return false;

  const normalizedBody = message.body.toLowerCase().trim();
  let isBotMentioned = false;
  if (message.mentionedIds?.length === 1) {
    const botLid = await resolveBotLid(client, client.info.wid._serialized);
    isBotMentioned = MentionUtils.isBotMentioned(message, botLid);
  }
  const isBotMention = botAliases.includes(normalizedBody) || isBotMentioned;

  const isGreetingMessage = matchesGreetingPattern(
    normalizedBody,
    chat.isGroup,
  );

  if (!isGreetingMessage && !isBotMention) {
    return false;
  }

  const reply = MessageUtils.mentions();
  await message.reply(reply);
  return true;
}
