/* eslint-disable indent */
/**
 * Respostas automáticas do bot quando mencionado.
 * O bot escolhe uma dessas respostas de forma aleatória.
 * @type {string[]}
 */
const botResponses = [
    'Opa! Você me chamou? ✨ Se precisar de algo, é só mandar um /start que eu te ajudo com todo carinho!',
    'Tcharaaam~! 🌟 Cheguei igual surpresa boa! Que tal testar o /sticker e criar figurinhas super fofas? 💖',
    'AdaBot prontinha para ajudar! ✨ Se quiser um resuminho das últimas mensagens, manda um /resume! 📜💌',
    'Nyaa~! 🐾 Eu senti que alguém precisava de mim! Coincidência? Acho que não! Manda um /start e deixa eu te ajudar! 💙',
    '⚡ *Pisca, pisca* Tô aqui! ✨ Quer transformar algo em figurinha? Manda um /sticker e eu faço com muito capricho! 🎀',
    'Oi, oi! 🥰 Quer ficar por dentro das últimas novidades? Digita /resume e eu te conto tudinho com detalhes! 📖💕',
    'Eu sou só um bot… MAS UM BOT MUITO LEGAL! Quer saber como posso te ajudar? Testa o /start! 💖',
    'Cheguei direto dos servidores pra deixar seu dia mais feliz! 💻💙 Quer figurinhas? Manda um /sticker! ✨',
    'Quer que eu organize as últimas mensagens pra você? 🔍 Manda um /resume e eu te conto tudo direitinho! 📜💛',
    'Pensa rápido! ⚡ Se precisar de algo, manda um /start e vem ver como eu posso te ajudar com muito carinho! 🥰',
    'Alguém me chamou? 🥺 Se foi só pra brincar, já testou o /sticker? Eu amo fazer figurinhas fofas! 🎀✨',
    'Oi, oi! 💕 AdaBot na área! Já testou o /resume? Vai que tem algo super interessante pra você! 👀💖',
    'Sabe qual sua sorte do dia? bons bots respondem rapidinho! Manda um /start e vem comigo! 💫',
];

/**
 * Respostas automáticas para erros ao enviar stickers.
 * O bot escolhe uma dessas respostas de forma aleatória.
 * @type {string[]}
 */
const sendStickerErrors = [
    'Ei, essa figurinha é grandinha demais pra mim! Que tal uma mais levinha? O limite é 1MB, hehe. 😊',
    'Opa, essa figurinha tá pesada! O WhatsApp só aceita até 1MB. Vamos tentar outra? 💖',
    'Erro 413: Figurinha gigante detectada! Mas não se preocupe, o limite é 1MB. Tente uma menor, tá bem? 🌸',
    'Essa figurinha é tão grande que o WhatsApp já desistiu! O máximo é 1MB, viu? 😅',
    'Isso era pra ser uma figurinha ou um filme em 4K? Reduza para menos de 1MB, por favorzinho! 🎀',
    'Essa figurinha é um pouquinho grandinha para o WhatsApp! O limite é 1MB, mas tenho certeza que você vai encontrar outra perfeitinha. Vamos tentar? 😊💖',
    'O WhatsApp olhou pra essa figurinha e disse: “Não, obrigado”. O limite é 1MB, meu bem! 💕',
    'O sistema ficou assustadinho! Essa figurinha ultrapassa o limite de 1MB. Vamos tentar outra? 🌈',
    'Essa figurinha tá tão grande que quase virou um pôster! O máximo é 1MB, tá? 😘',
    'Quer enviar um cartaz de cinema? Porque essa figurinha ultrapassou o limite de 1MB! Vamos de outra? 🎬',
    'Ops, o WhatsApp só aceita figurinhas menores que 1MB. Essa aí tá querendo ser um outdoor! 😂',
    'Até criei sua figurinhan, mas o WhatsApp não deixou enviar. O limite é 1MB, viu? Vamos tentar de novo? 🚪💖',
];

/**
 * Gera um prompt para analisar e resumir mensagens em um grupo.
 * @param {string} chatName - Nome do grupo onde ocorreu a conversa.
 * @param {string[]} textMessages - Array de mensagens trocadas no grupo.
 * @returns {string} Um prompt estruturado para ser usado em um modelo de IA.
 */
const groupPrompt = (chatName, textMessages) => `
Oi, pessoal! Sou a AdaBot, sua assistente super amigável! 🌸 Vou analisar as mensagens do grupo "${chatName}" e fazer um resuminho bem clarinho e objetivo pra vocês. Aqui estão as regrinhas que vou seguir:
1. **Destaque os principais temas:** Vou identificar os assuntos mais importantes que vocês discutiram.  
2. **Interações relevantes:** Vou mencionar as conversas mais interessantes entre os participantes, sempre chamando vocês de "participantes" ou "usuários".  
3. **Ignorar o irrelevante:** Mensagens repetidas ou sem contexto significativo? Nem vou citar!  
4. **Opinião descontraída:** No final, vou soltar uma observaçãozinha leve e irônica, mas sem falar que é minha opinião, tá? 😉  

Agora, vamos ao resumo do grupo "${chatName}": \n\n${textMessages}
`;

/**
 * Gera um prompt para analisar e resumir mensagens em uma conversa individual.
 * @param {string} chatName - Nome do usuário com quem a conversa ocorreu.
 * @param {string[]} textMessages - Array de mensagens trocadas na conversa.
 * @returns {string} Um prompt estruturado para ser usado em um modelo de IA.
 */
const userPrompt = (chatName, textMessages) => `
Olá, querido(a)! Sou a AdaBot, sua assistente super atenciosa! 🌟 Vou analisar as mensagens trocadas com "${chatName}" e fazer um resuminho bem clarinho e objetivo pra você. Aqui estão as regrinhas que vou seguir:

1. **Destaque os principais temas:** Vou identificar os assuntos mais importantes que vocês conversaram.  
2. **Contribuições relevantes:** Vou destacar os pontos mais interessantes que você trouxe para a conversa.  
3. **Ignorar o irrelevante:** Mensagens repetidas ou sem contexto significativo? Nem vou citar!  
4. **Opinião descontraída:** No final, vou soltar uma observaçãozinha leve e envolvente, mas sem falar que é minha opinião, tá? 😊  

Agora, vamos ao resumo da sua conversa com "${chatName}": \n\n${textMessages}
`;

module.exports = {
    botResponses,
    sendStickerErrors,
    userPrompt,
    groupPrompt,
};
