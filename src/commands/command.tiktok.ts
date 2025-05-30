import { downloadTikTok } from '@/services';
import { ICommand } from '../../types';

export const TikTokCommand: ICommand = {
    name: '/tiktok',
    aliases: ['/tk', '/ttk'],
    onlyGroup: true,
    async execute({ message, client }) {
        return await downloadTikTok(message, client);
    }
}; 