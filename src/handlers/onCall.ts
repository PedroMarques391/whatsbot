import { Call, Client } from "whatsapp-web.js";
import { texts } from "../utils";

export async function onCall(client: Client, call: Call) {
    if (!call.from) return
    const rejectCall = texts.callRejection[Math.floor(Math.random() * texts.callRejection.length)];
    await call.reject();
    await client.sendMessage(
        call.from,
        rejectCall,
    );

}