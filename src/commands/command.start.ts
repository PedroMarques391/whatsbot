import { start } from "../services";
import { ICommand } from "../../types";

export const StartCommand: ICommand = {
    name: '/start',
    onlyGroup: false,
    async execute({ message, client }) {
        return start(message, client);
    }
};