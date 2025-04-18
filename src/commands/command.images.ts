import { imageSearch } from "../services";
import { ICommand } from "../../types";

export const ImagesCommand: ICommand = {
    name: "/images",
    onlyGroup: false,
    async execute({ message, chat, client }) {
        await imageSearch(message, chat, client)
    }
}