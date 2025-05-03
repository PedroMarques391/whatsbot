import { ICommand } from '../../types';


export async function commandHandler(body: string, commands: ICommand[]): Promise<ICommand | undefined> {
    const normalized = body.toLowerCase().trim();

    return commands.find(command => {
        const name = command.name.toLowerCase();
        const commandFound = normalized === name || normalized.startsWith(`${name} `);

        const aliasFound = command.aliases?.some(alias => {
            const aliasNormalized = alias.toLowerCase();
            return normalized === aliasNormalized || normalized.startsWith(`${aliasNormalized} `);
        });

        return commandFound || aliasFound;
    });
}
