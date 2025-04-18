import { makeSticker } from "../services";
import { ICommand } from "../../types";

export const StickerCommand: ICommand = {
    name: "/sticker",
    aliases: ["/s"],
    onlyGroup: false,
    async execute({ message, client }) {
        await makeSticker(message, client);
    },
}