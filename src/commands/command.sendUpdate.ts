import { sendUpdateMessages } from '@/helpers';
import { ICommand } from '../../types';

export const SendUpdateCommand: ICommand = {
    name: '/sendUpdate',
    onlyGroup: false,
    conditions: ({ message }) => message.fromMe,
    async execute({ client, message }) {
        await sendUpdateMessages(client, message);
    },
};