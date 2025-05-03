import { demoteParticipant } from '@/services';
import { ICommand } from '../../types';

export const DemoteCommand: ICommand = {
    name: '/demote',
    onlyGroup: true,
    async execute({ message, chat, client }) {
        await demoteParticipant(message, chat, client);
    }
};