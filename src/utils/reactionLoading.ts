import { Message } from "whatsapp-web.js";
import { TimerUtils } from "./timers";

export class ReactionLoadingUtils {
  private static readonly LOADING_HEARTS = [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "💖",
  ];

  static start(message: Message, intervalMs = 500): () => void {
    let isRunning = true;
    let index = 0;

    (async () => {
      while (isRunning) {
        const emoji = this.LOADING_HEARTS[index % this.LOADING_HEARTS.length];
        index++;
        await message.react(emoji).catch(() => {});
        if (!isRunning) break;
        await TimerUtils.delay(intervalMs);
      }
    })();

    return () => {
      isRunning = false;
    };
  }
}
