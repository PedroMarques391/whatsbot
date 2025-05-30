import { resumeMessages } from '@/services';
import { ICommand } from '../../types';

export const ResumeCommand: ICommand = {
    name: '/resume',
    onlyGroup: false,
    async execute({ client, message }) {
        await resumeMessages(client, message);
    }
};