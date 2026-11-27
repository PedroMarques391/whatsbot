import { Chat, Client, Message } from "whatsapp-web.js";
import { ICommand } from "../../types";
import { greeting } from "./interactions/onGreeting";
import { quotedReply } from "./interactions/onQuotedReply";
import { validateBlockedCommand } from "./validations/validateBlockedCommand";
import { validateCommand } from "./validations/validateCommand";
import { validateConditions } from "./validations/validateConditions";
import { validateOnlyGroup } from "./validations/validateOnlyGroup";

async function interactionsHandler(
  message: Message,
  chat: Chat,
  client: Client,
): Promise<boolean> {
  if (await greeting(message, chat, client)) return true;
  if (await quotedReply(message)) return true;
  return false;
}

async function validatorsHandler(
  command: ICommand,
  message: Message,
  chat: Chat,
  client: Client,
): Promise<boolean> {
  if (await validateOnlyGroup(command, chat, message)) return true;
  if (await validateBlockedCommand(command, chat, message)) return true;
  if (validateConditions(command, message, chat, client)) return true;

  return false;
}

export { interactionsHandler, validateCommand, validatorsHandler };
