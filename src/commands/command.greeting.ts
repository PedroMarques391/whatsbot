import { greeting } from '@/middleware/interactions/onGreeting';
import { ICommand } from '../../types';
import { CLIENT_NUMBER } from '../config/env';

export const GreetingCommand: ICommand = {
    name: 'ada',
    aliases: ['adabot', `@${CLIENT_NUMBER.split('@')[0]}`],
    conditions: ({ message }) => !message.fromMe,
    async execute({ message, chat }) {
        await greeting(message, chat);
    }
};