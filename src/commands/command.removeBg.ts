import { removeBg } from '@/services';
import { ICommand } from '../../types';

export const RemoveBgCommand: ICommand = {
    name: '/removeBg',
    description: 'Remove o fundo de uma imagem',
    aliases: ['/rmbg'],
    onlyGroup: false,
    async execute({ message, chat, client }) {
        await removeBg(message, chat, client);
    }
};