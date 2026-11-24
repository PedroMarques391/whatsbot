import { MessageUtils } from "@/utils";
import { Call, Client } from "whatsapp-web.js";

export async function onCall(client: Client, call: Call) {
  if (!call.from) return;
  const rejectCall = MessageUtils.callRejections();
  await call.reject();
  await client.sendMessage(call.from, rejectCall);
}
