import { promoteParticipant } from "../services";
import { ICommand } from "../../types";

export const PromoteCommand: ICommand = {
    name: "/promote",
    onlyGroup: true,
    async execute({ message, chat, client }) {
        await promoteParticipant(message, chat, client)
    },
}