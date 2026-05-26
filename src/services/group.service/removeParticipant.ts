import {
  authorIsAdmin,
  botIsAdmin,
  isAuthorOrBot,
  notAValidNumber,
} from "@/helpers";
import { isUserNotInGroup } from "@/helpers/validation/isUserNotInGroup";
import { serializeMention } from "@/utils";
import { GroupChat, Message } from "whatsapp-web.js";
import { BotError } from "@/errors/BotErrors";

export async function removeParticipant(message: Message, chat: GroupChat) {
  await Promise.all([
    botIsAdmin(chat),
    notAValidNumber(message, "/ban"),
    authorIsAdmin(chat, message),
    isUserNotInGroup(chat, message),
  ]);

  const { serializedNumber } = await serializeMention(message);

  if (isAuthorOrBot(message)) {
    throw BotError.validation(
      "Sua intenção é curiosa, mas não permito que remova a si mesmo ou a mim. Vamos focar os esforços onde realmente importa. ☕",
    );
  }

  await chat.removeParticipants([serializedNumber]);
  return;
}
