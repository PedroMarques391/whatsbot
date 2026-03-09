import { response } from '@/services';
import { ICommand } from '../../types';

export const TalkCommand: ICommand = {
    name: 'ada',
    onlyGroup: false,
    aliases: ['ada,', 'adabot,'],
    async execute({ message }) {
        await response(message, 1, 200);
    },

}; 