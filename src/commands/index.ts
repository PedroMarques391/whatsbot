import { ICommand } from '../../types';
import { AddCommand } from './command.add';
import { DemoteCommand } from './command.demote';
import { ImagesCommand } from './command.images';
import { ListCommand } from './command.list';
import { PastCommand } from './command.past';
import { PromoteCommand } from './command.promote';
import { RemoveCommand } from './command.remove';
import { RenameCommand } from './command.rename';
import { ResumeCommand } from './command.resume';
import { SendUpdateCommand } from './command.sendUpdate';
import { StartCommand } from './command.start';
import { StickerCommand } from './command.sticker';
import { TalkCommand } from './command.talk';
import { TestCommand } from './command.test';
import { RemoveBgCommand } from './command.removeBg';
import { TikTokCommand } from './command.tiktok';



const commands: ICommand[] = [
    ListCommand, PastCommand, StartCommand,
    AddCommand, RemoveCommand, PromoteCommand,
    DemoteCommand, ImagesCommand, ResumeCommand,
    StickerCommand, SendUpdateCommand, TalkCommand,
    TestCommand, RenameCommand, RemoveBgCommand, TikTokCommand
];

export async function commandHandler(body: string): Promise<ICommand | undefined> {
    const normalized = body.toLowerCase().split(' ')[0];
    return commands.find(command => {
        const name = command.name.toLowerCase();
        const commandFound = normalized === name;

        const aliasFound = command.aliases?.some(alias => {
            const aliasNormalized = alias.toLowerCase();
            return normalized === aliasNormalized;
        });

        return commandFound || aliasFound;
    });
}





