import { ICommand } from "../../types";
import { AddCommand } from "./command.add";
import { BlockCommand } from "./command.block";
import { DemoteCommand } from "./command.demote";
import { GetRevokedMessagesCommand } from "./command.getRevokedMessages";
import { HelpCommand } from "./command.help";
import { ImagesCommand } from "./command.images";
import { InfoCommand } from "./command.info";
import { InstagramCommand } from "./command.instagram";
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
import { PinterestCommand } from "./command.pinterest";
import { TestCommand } from "./command.test";
import { TikTokCommand } from "./command.tiktok";
import { TwitterCommand } from "./command.twitter";
import { UnblockCommand } from "./command.unblock";
import { YouTubeCommand } from "./command.youtube";

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
  InstagramCommand,
  YouTubeCommand,
  TwitterCommand,
  PinterestCommand,
  InfoCommand,
  RegisterCommand,
  BlockCommand,
  UnblockCommand,
  HelpCommand,
  SetWelcomeCommand,
  SetExitMessageCommand,
  GetRevokedMessagesCommand,
];

export async function commandHandler(body: string): Promise<ICommand | null> {
  const normalized = body.toLowerCase().split(" ")[0];

  const [commandName, ...args] = body.trim().split(/\s+/);

  for (const command of commands) {
    const commandAndAliases = [command.name, ...(command.aliases || [])].map(
      (cmd) => cmd.toLowerCase(),
    );

    const matches = commandAndAliases.some((cmd) => normalized === cmd);

    if (matches) {
      return command;
    }
  }
  return null;
}
