/* eslint-disable indent */

/**
 * @description Função para enviar a ficha dos menbros do grupo(edite como quiser).
 * @param {WAWebJS.Message} chat Chat do grupo em questão.
 * @param {Client} client Client.
 * @param {WAWebJS.Participant[]} members Membros do grupo em questão.
 */
async function DLIntro(chat, client, members) {
    if (chat.id._serialized === '120363370825903481@g.us'
        || chat.id._serialized === '120363046974763940@g.us') {
        let text = '✨---- Ficha dos Membros ----✨\n\n';

        const mentions = [];

        for (const member of members) {
            mentions.push(`${member.id}@c.us`);
            text += `
  🧑 Menção: @${member.id}
  👤 Nome: ${member.name}  
  📝 Apelidos: ${member.nicknames.join(', ')}  
  🧠 Personalidade: ${member.personality}  
  🎂 Idade: ${member.age} anos  
  📍 Estado: ${member.state}  
  
  🐾 Animais Favoritos: ${member.favoriteAnimals.join(', ')}  
  😊 Emojis Favoritos: ${member.favoriteEmojis.join(' ')}  
  🎶 Músicas Favoritas: ${member.favoriteSongs.join(', ')}  
  
  🎯 Hobbies: ${member.hobbies.join(', ')}  
  🎲 Fato Aleatório: ${member.randomFact}  
  🚨 Gatilhos: ${member.triggers.join(', ')}  
  
  📚 Estudos: ${member.studies}  
  💼 Profissão: ${member.profession}  
  
  ✨---- Fim do Membro ----✨  
  `;
        }
        await client.sendMessage(chat.id._serialized, text, { mentions });
        return;
    }
    return client.sendMessage(chat.id._serialized, 'Esse comando só pode ser usando em um grupo espeficico.');
}

module.exports = { DLIntro };
