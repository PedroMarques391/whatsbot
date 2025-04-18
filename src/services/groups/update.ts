import { Client, Message, MessageMedia } from "whatsapp-web.js";
import path from "path";
import { helpers } from "./../../utils";
import { CLIENT_NUMBER } from "../../config/env";
import { geminiResponse } from "../ai";
import { extractTextFromBody } from "../../utils/helpers";

export const sendUpdateMessages = async (client: Client, message: Message) => {
    const body: string = extractTextFromBody(message.body)
    const chats = await client.getChats();
    const groups = chats.filter((chat) => chat.isGroup).map((chat) => chat.id._serialized);

    if (!body) {
        await client.sendMessage(CLIENT_NUMBER, "Ops! Parece que a mensagem está vazia. Por favor, me envie as atualizações para que eu possa compartilhá-las, tá bom? 😊");
        return
    }

    const instruction: string = "Create a detailed and engaging update message tailored for group announcements. Ensure it is clear, concise, and maintains a friendly tone";

    const text: string = await geminiResponse(`${instruction}: ${body}`, 0.7, 200);


    const media = MessageMedia.fromFilePath(path.resolve(process.cwd(), 'src/assets/images/adaUpdate.jpg'));
    for (const group of groups) {
        await client.sendMessage(group, media, { caption: text });
        await helpers.delay(2000);
    }
};