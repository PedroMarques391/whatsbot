import { leave } from "@/services";
import { GroupNotification } from "whatsapp-web.js";

export async function onGroupLeave(notification: GroupNotification) {
  await leave(notification);
}
