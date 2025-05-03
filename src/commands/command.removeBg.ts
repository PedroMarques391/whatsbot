import { removeBg } from '@/services';
import { ICommand } from '../../types';

export const RemoveBgCommand: ICommand = {
    name: '/removeBg',
    aliases: ['/rmbg'],
    onlyGroup: false,
    async execute({ message, chat, client }) {
        await removeBg(message, chat, client);
    }
};