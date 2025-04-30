import { testFunction } from "../services/index";
import { ICommand } from "../../types";

export const TestCommand: ICommand = {
    name: "/test",
    onlyGroup: true,
    async execute({ message, chat, client }) {
        return await testFunction(message, chat, client)
    }
} 