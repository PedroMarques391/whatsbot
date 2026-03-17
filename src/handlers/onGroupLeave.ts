import { Client, GroupNotification } from 'whatsapp-web.js';
import { leave } from '@/services';

export async function onGroupLeave(client: Client, notification: GroupNotification) {
    await leave(notification, client);
}
