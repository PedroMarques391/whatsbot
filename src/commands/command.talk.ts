import { ICommand } from "../../types";
import { response } from "../services";

export const TalkCommand: ICommand = {
    name: "ada",
    onlyGroup: false,
    async execute({ message }) {
        await response(message, 1, 200)
    },

}