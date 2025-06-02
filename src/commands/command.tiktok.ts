import { downloadTikTok } from '@/services';
import { ICommand } from '../../types';

export const TikTokCommand: ICommand = {
    name: '/tiktok',
    aliases: ['/tk', '/ttk'],
    onlyGroup: false,
    async execute({ message, client }) {
        return await downloadTikTok(message, client);
    }
}; 