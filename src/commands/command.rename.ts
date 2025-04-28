import { renameSticker } from "../services/sticker";
import { ICommand } from "../../types";

export const RenameCommand: ICommand = {
    name: "/rename",
    onlyGroup: false,
    async execute({ client, message, chat }) {
        await renameSticker(message, chat, client)
    }

}