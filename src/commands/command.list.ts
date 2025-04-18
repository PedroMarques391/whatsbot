import { listMembers } from "../services";
import { ICommand } from "../../types/commands";

export const ListCommand: ICommand = {
    name: '/list',
    onlyGroup: true,
    async execute({ chat }) {
        return listMembers(chat);
    }
};

