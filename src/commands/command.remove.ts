import { removeParticipant } from '@/services';
import { GroupChat } from 'whatsapp-web.js';
import { ICommand } from '../../types';

export const RemoveCommand: ICommand = {
    name: '/rm',
    onlyGroup: true,
    aliases: ['/remove', '/rmv', '/ban'],
    async execute({ message, chat }) {
        await removeParticipant(message, chat as GroupChat);
    }
};