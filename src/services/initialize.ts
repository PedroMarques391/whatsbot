import { delay } from "@/utils";
import path from "path";
import { Client, Message, MessageMedia } from "whatsapp-web.js";

export async function init(client: Client) {
  try {
    await delay(200);

    const groupID = process.env.GROUPS_IDS?.split(",") || [];
    for (let i = 0; i < groupID.length; i++) {
      const media: MessageMedia = MessageMedia.fromFilePath(
        path.resolve(process.cwd(), "src/assets/images/adaInit.jpg"),
      );

      const messageToSend = "🌸✨*AdaBot está online!*✨🌸";

      await client.sendMessage(`${groupID[i]}@g.us`, media, {
        caption: messageToSend,
      });
    }

    console.log("Mensagem enviada com sucesso para o grupo:", groupID);
  } catch (error) {
    console.error("Ocorreu um erro ao enviar a mensagem:", error);
  }
}

export async function start(message: Message, client: Client) {
  const chat = await message.getChat();
  const contact = await message.getContact();
  const date = new Date();
  const hours: string | number =
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes: string | number =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds: string | number =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  const menu = `
    ╭━━━ ◉ *Menu* ◉ ━━━╮
    
    ◉━━━ *AdaBot* ━━━◉  
    🌺 Olá, @${contact.number}! Eu sou a Ada.  
    🌺 Todos os comandos devem iniciar com " / ".  
    🌺 Chat: ${contact.pushname} 
    🌺 Hora: ${hours}:${minutes}:${seconds}  
    
    ╭─≺ *Infos* ≻─╮  
    ┃ ➤ /start - Mostrar este menu.  
    ┃ ➤ /info - Ver informações do bot.  
    ╰─────≺∆≻─────╯  
    
    ╭─≺ *Grupos* ≻─╮  
    ┃ ➤ /list - Listar membros do grupo.  
    ┃ ➤ /past - Mostrar ex-membros do grupo.  
    ╰─────≺∆≻─────╯  
    
    ╭─≺ *Administradores* ≻─╮  
    ┃ ➤ /add + número - Adicionar participante.  
    ┃ ➤ /ban + @user - Remover participante.  
    ┃ ➤ /upgrade + @user - Promover a admin.  
    ┃ ➤ /downgrade + @user - Rebaixar admin.  
    ┃ ➤ /block + /command - Bloquear comando.  
    ╰──────≺∆≻──────╯  
    
    ╭─≺ *Geral* ≻─╮  
    ┃ ➤ /sticker - Criar figurinha (envie imagem/vídeo).  
    ┃ ➤ /resume - Resumir últimas mensagens.  
    ┃ ➤ /rename + nome - Altera o nome da figurinha.  
    ┃ ➤ /removeBg - Remove o fundo da imagem marcada ou enviada. 
    ┃ ➤ /tiktok + url - Baixa o vídeo pelo link.  
    ┃ ➤ /images + descrição - Buscar imagens.  
    ┃ ➤ /register - Registrar usuário.  
    ╰─────≺∆≻─────╯  
    
    ╭─≺ *Converse Comigo* ≻─╮  
    ┃ 💬 Me chame carinhosamente:  
    ┃    Exemplo → *Ada, qual sua música favorita?* 🎶  
    ┃ ou responda minha mensagem hihihi ❤️
    ┃ 🐾 Eu vou responder com muito amor e fofura! 💕  
    ╰────────────╯
    
    ╰━━━◉ ^__^ ◉━━━╯
    
    `;
  const media: MessageMedia = MessageMedia.fromFilePath(
    path.resolve(process.cwd(), "src/assets/images/adaInit.jpg"),
  );
  await client.sendMessage(chat.id._serialized, media, {
    caption: menu,
    mentions: [contact.id._serialized],
  });

  await message.react("❤️");
}
