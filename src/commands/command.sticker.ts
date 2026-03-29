import { makeSticker } from '@/services';
import { ICommand } from '../../types';

export const StickerCommand: ICommand = {
    name: '/sticker',
    description: 'Cria uma figurinha a partir de imagem ou vídeo',
    aliases: ['/s'],
    onlyGroup: false,
    async execute({ message, client }) {
        await makeSticker(message, client);
    },
};