import { extractTextFromBody } from "../utils/helpers"
import { Chat, Client, Message } from "whatsapp-web.js";

export async function textFunction(message: Message, chat: Chat, client: Client) {
    const name = extractTextFromBody(message.body)
    const quotedMessage = await message.getQuotedMessage()

    if (!message.hasQuotedMsg || quotedMessage.type !== "sticker") {
        await message.reply("Preciso de uma figurinha para ser renomeada.")
        return
    }
    if (name.length > 20 || name.length === 0) {
        const reply = name.length > 10 ? "Não acha esse nome muito grande? aprende a ser gente." : "Que criativo, um nome vazio. Não vou fazer isso."
        await message.reply(reply)
        return
    }

    console.log(message)
    const media = await quotedMessage.downloadMedia()

    await client.sendMessage(chat.id._serialized, media,
        {
            sendMediaAsSticker: true,
            stickerName: name,
            stickerAuthor: "AdaBot",
            stickerCategories: ["figs"]
        })

}