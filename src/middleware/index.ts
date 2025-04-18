import { Chat, Client, Message } from "whatsapp-web.js";
import { greeting } from "./interactions/onGreeting";
import { quotedReply } from "./interactions/onQuotedReply";
import { ICommand } from "../../types";
import { validateCommand } from "./validations/validateCommand";
import { validateOnlyGroup } from "./validations/validateOnlyGroup";
import { validateConditions } from "./validations/validateConditions";
import { isViewOnce } from "./interactions/onisViewOnce";


async function interactionsHandler(message: Message, quotedMessage: Message, chat: Chat, client: Client): Promise<boolean> {
    if (await greeting(message, chat)) return true;
    if (await quotedReply(message, quotedMessage)) return true;
    if (await isViewOnce(message, client)) return true;
    return false
}

async function validatorsHandler(command: ICommand, message: Message, chat: Chat, client: Client): Promise<boolean> {
    if (await validateOnlyGroup(command, chat, message)) return true
    if (validateConditions(command, message, chat, client)) return true

    return false
}


export {
    interactionsHandler,
    validatorsHandler,
    validateCommand
}