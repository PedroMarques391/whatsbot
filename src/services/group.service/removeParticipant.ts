import {
  authorIsAdmin,
  botIsAdmin,
  isAuthorOrBot,
  notAValidNumber,
} from "@/helpers";
import { isUserNotInGroup } from "@/helpers/validation/isUserNotInGroup";
import { extractTextFromBody } from "@/utils";
import { Client, GroupChat, Message } from "whatsapp-web.js";

export async function removeParticipant(
  message: Message,
  chat: GroupChat,
  client: Client,
) {
  try {
    await Promise.all([
      botIsAdmin(chat),
      notAValidNumber(message, "/rm"),
      authorIsAdmin(chat, message),
      isUserNotInGroup(chat, message, client),
    ]);
    if (isAuthorOrBot(message)) {
      return message.reply(
        "Sua intenção é curiosa, mas não permito que remova a si mesmo ou a mim. Vamos focar os esforços onde realmente importa. ☕",
      );
    }
    await chat.removeParticipants([
      `${extractTextFromBody(message.body)}@c.us`,
    ]);
    return;
  } catch (error: any) {
    return message.reply(error.message);
  }
}
