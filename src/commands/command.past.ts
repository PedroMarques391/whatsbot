import { showPastMembers } from "../services";
import { ICommand } from "../../types";
import { GroupChat } from "whatsapp-web.js";


export const PastCommand: ICommand = {
    name: '/past',
    onlyGroup: true,
    async execute({ chat }) {
        return showPastMembers(chat as GroupChat);
    }
};