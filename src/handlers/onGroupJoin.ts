import { join } from "@/services";
import { GroupNotification } from "whatsapp-web.js";

export async function onGroupJoin(notification: GroupNotification) {
  await join(notification);
}
