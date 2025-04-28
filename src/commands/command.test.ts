import { textFunction } from "@services/test";
import { ICommand } from "../../types";

export const TestCommand: ICommand = {
    name: "/test",
    onlyGroup: true,
    async execute({ message, chat }) {
        return await textFunction()
    }
} 