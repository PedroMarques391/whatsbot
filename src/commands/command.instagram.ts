import { downloadInstagram } from '@/services';
import { ICommand } from '../../types';

export const InstagramCommand: ICommand = {
    name: '/instagram',
    description: 'Baixa um vídeo ou reels do Instagram',
    sintaxe: '/instagram <link>',
    aliases: ['/ig', '/insta', '/reels'],
    onlyGroup: false,
    async execute({ message, client }) {
        return await downloadInstagram(message, client);
    }
};
