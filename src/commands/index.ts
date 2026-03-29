import { ICommand } from "../../types";
import { AddCommand } from "./command.add";
import { BlockCommand } from "./command.block";
import { DemoteCommand } from "./command.demote";
import { HelpCommand } from "./command.help";
import { ImagesCommand } from "./command.images";
import { InfoCommand } from "./command.info";
import { ListCommand } from "./command.list";
import { PastCommand } from "./command.past";
import { PromoteCommand } from "./command.promote";
import { RegisterCommand } from "./command.register";
import { RemoveCommand } from "./command.remove";
import { RemoveBgCommand } from "./command.removeBg";
import { RenameCommand } from "./command.rename";
import { ResumeCommand } from "./command.resume";
import { SendUpdateCommand } from "./command.sendUpdate";
import { SetExitMessageCommand } from "./command.setExit";
import { SetWelcomeCommand } from "./command.setWelcome";
import { StartCommand } from "./command.start";
import { StickerCommand } from "./command.sticker";
import { TalkCommand } from "./command.talk";
import { TestCommand } from "./command.test";
import { TikTokCommand } from "./command.tiktok";
import { UnblockCommand } from "./command.unblock";

const commands: ICommand[] = [
  ListCommand,
  PastCommand,
  StartCommand,
  AddCommand,
  RemoveCommand,
  PromoteCommand,
  DemoteCommand,
  ImagesCommand,
  ResumeCommand,
  StickerCommand,
  SendUpdateCommand,
  TalkCommand,
  TestCommand,
  RenameCommand,
  RemoveBgCommand,
  TikTokCommand,
  InfoCommand,
  RegisterCommand,
  BlockCommand,
  UnblockCommand,
  HelpCommand,
  SetWelcomeCommand,
  SetExitMessageCommand,
];

export async function commandHandler(
  body: string,
): Promise<ICommand | undefined> {
  const normalized = body.toLowerCase().split(" ")[0];
  return commands.find((command) => {
    const name = command.name.toLowerCase();
    const commandFound = normalized === name;

    const aliasFound = command.aliases?.some((alias) => {
      const aliasNormalized = alias.toLowerCase();
      return normalized === aliasNormalized;
    });

    return commandFound || aliasFound;
  });
}
