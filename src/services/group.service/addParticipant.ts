import { authorIsAdmin, botIsAdmin, groupParticipants } from "@/helpers";
import { extractTextFromBody } from "@/utils";
import { GroupChat, Message } from "whatsapp-web.js";

export async function addParticipant(message: Message, chat: GroupChat) {
  type ParticipantResponse = {
    code: number;
    message: string;
    isInviteV4Sent: boolean;
  };

  try {
    await Promise.all([botIsAdmin(chat), authorIsAdmin(chat, message)]);
    if (
      groupParticipants(chat).includes(
        `${extractTextFromBody(message.body)}@c.us`,
      )
    ) {
      return message.reply(
        `Noto que esta pessoa já faz parte do nosso grupo. Não precisamos de convites duplicados, certo? ✨`,
      );
    }

    const newMenbers = extractTextFromBody(message.body)
      .split(" ")
      .map((num) => `${num}@c.us`);

    console.log(newMenbers);
    await chat.addParticipants([...newMenbers]).then((participants) => {
      Object.entries(participants).forEach(
        ([number, data]: [string, ParticipantResponse]) => {
          console.log(number, data);
          if (data.isInviteV4Sent) {
            message.reply(
              `Convite enviado com sucesso para ${number.replace("@c.us", "")}!`,
            );
            return;
          }
          if ([403, 408, 404].includes(data.code)) {
            message.reply(
              `error to add ${number.replace("@c.us", "")}: ${data.message}`,
            );
            return;
          }

          if (data.code === 400) {
            message.reply(
              "O número que você me enviou parece ter algum detalhe incorreto. Tente adicionar *55* e remover o digito *9* se tiver.",
            );
            return;
          }
        },
      );
    });

    return;
  } catch (error: any) {
    await message.reply(error.message);
  }
}
