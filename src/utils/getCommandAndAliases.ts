import { ICommand } from "types";

export function getCommandAndAliases(commandName: ICommand): string[] {
  const name = commandName.name.toLowerCase();
  const aliases =
    commandName.aliases?.map((alias) => alias.toLowerCase()) || [];
  return [name, ...aliases];
}
