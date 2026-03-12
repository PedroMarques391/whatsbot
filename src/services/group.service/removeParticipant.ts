import {
  authorIsAdmin,
  botIsAdmin,
  isAuthorOrBot,
  isNotInGroup,
  notAValidNumber,
} from "@/helpers";
import { extractTextFromBody } from "@/utils";
import { GroupChat, Message } from "whatsapp-web.js";

export async function removeParticipant(message: Message, chat: GroupChat) {
  try {
    await Promise.all([
      botIsAdmin(chat),
      notAValidNumber(message, "/rm"),
      authorIsAdmin(chat, message),
      isNotInGroup(chat, message),
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
