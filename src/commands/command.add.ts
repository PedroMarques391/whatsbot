import { addParticipant } from '@/services';
import { ICommand } from '../../types';

export const AddCommand: ICommand = {
    name: '/add',
    onlyGroup: true,
    async execute({ message, chat }) {
        return await addParticipant(message, chat);
    }
}; 