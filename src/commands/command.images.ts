import { imageSearch } from '@/services';
import { ICommand } from '../../types';

export const ImagesCommand: ICommand = {
    name: '/images',
    description: 'Busca imagens no Google',
    sintaxe: '/images <termo de busca>',
    onlyGroup: false,
    async execute({ message, chat, client }) {
        await imageSearch(message, chat, client);
    }
};