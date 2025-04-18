import { ICommand } from "../../types";
import { sendUpdateMessages } from "../services";

export const SendUpdateCommand: ICommand = {
    name: "/sendUpdate",
    onlyGroup: false,
    conditions: ({ message }) => message.fromMe,
    async execute({ client, message }) {
        await sendUpdateMessages(client, message)
    },
}