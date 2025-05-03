import { callRejection } from '@/utils';
import { Call, Client } from 'whatsapp-web.js';

export async function onCall(client: Client, call: Call) {
    if (!call.from) return;
    const rejectCall = callRejection[Math.floor(Math.random() * callRejection.length)];
    await call.reject();
    await client.sendMessage(
        call.from,
        rejectCall,
    );

}