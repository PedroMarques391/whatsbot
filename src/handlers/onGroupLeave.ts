import { Client, GroupNotification } from "whatsapp-web.js";

export async function onGroupLeave(
  client: Client,
  notification: GroupNotification,
) {
  console.log(notification);
}
