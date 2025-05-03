import { Client, GroupNotification } from 'whatsapp-web.js';
import { join } from '@/services';

export async function onGroupJoin(client: Client, notification: GroupNotification) {
    await join(notification, client);
}