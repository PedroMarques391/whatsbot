import { removeParticipant } from '@/services';
import { ICommand } from '../../types';

export const RemoveCommand: ICommand = {
    name: '/rm',
    onlyGroup: true,
    async execute({ message, chat }) {
        await removeParticipant(message, chat);
    }
};