import { Client, Message } from "whatsapp-web.js";
import { onCall, onGroupJoin, onMessageCreate, onRevoke } from "../handlers";


export function eventHandler(client: Client) {
    client.on('group_join', async (notif) => await onGroupJoin(client, notif));
    client.on('call', async (call) => await onCall(client, call));
    client.on("message_create", async (message: Message) => await onMessageCreate(client, message));
    client.on('message_revoke_everyone', async (msg, revoked) => await onRevoke(msg, revoked));
}