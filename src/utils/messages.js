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
 * Respostas automáticas do bot quando recebe ligações.
 * O bot escolhe uma dessas respostas de forma aleatória.
 * @type {string[]}
 */
const rejectCallResponses = [
    '📞 *AdaBot*: Oiê! Eu rejeito ligações automaticamente, mas se eu estiver por perto, jaja falo com você! 😊 Calma aí, já volto! 💖✨',
    '📞 *AdaBot*: Olá! Ligação rejeitada, mas não se preocupe, se eu estiver aqui, já te respondo! 😉 Fica tranquilo(a)! 💕🌸',
    '📞 *AdaBot*: Oops! Rejeitei a ligação, mas se eu estiver por perto, jaja te ajudo! 😊 Espera só um pouquinho! 💖✨',
    '📞 *AdaBot*: Eita! Ligação recusada, mas se eu estiver online, já te atendo! 😄 Fica de boa, já volto! 💕🌟',
    '📞 *AdaBot*: Oi! Rejeitei a ligação, mas se eu estiver por aqui, jaja falo com você! 😊 Calma, já tô chegando! 💖🌸',
    '📞 *AdaBot*: Olá! Ligação recusada, mas se eu estiver disponível, já te respondo! 😉 Relaxa, já volto! 💕✨',
    '📞 *AdaBot*: Oiê! Rejeitei a ligação, mas se eu estiver por perto, jaja te ajudo! 😊 Espera só um instante! 💖🌟',
    '📞 *AdaBot*: Oops! Ligação recusada, mas se eu estiver aqui, já te atendo! 😄 Fica tranquilo(a), já volto! 💕🌸',
    '📞 *AdaBot*: Oi! Rejeitei a ligação, mas se eu estiver por perto, jaja falo com você! 😊 Calma aí, já tô chegando! 💖✨',
    '📞 *AdaBot*: Olá! Ligação recusada, mas se eu estiver online, já te respondo! 😉 Relaxa, já volto! 💕🌟',
    '📞 *AdaBot*: Oiê! Rejeitei a ligação, mas se eu estiver por aqui, jaja te ajudo! 😊 Espera só um pouquinho! 💖🌸',
    '📞 *AdaBot*: Oops! Ligação recusada, mas se eu estiver disponível, já te atendo! 😄 Fica de boa, já volto! 💕✨',
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
Ada, analise as mensagens do grupo "${chatName}" e faça um resuminho bem clarinho e objetivo. Aqui estão as regrinhas que você deve seguir:

1. **Destaque os principais temas:** Identifique os assuntos mais importantes que foi discutido.  
2. **Interações relevantes:** Mencione as conversas mais interessantes entre os participantes.  
3. **Ignorar o irrelevante:** Mensagens repetidas ou sem contexto significativo? Não precisa citar!  
4. **Citação:** User termos em primeira pessoa para se referir a você mesma.  
5. **Opinião descontraída:** No final, faça uma observação leve e irônica, mas sem falar que é sua opnião. 

Agora, faça o resumo do grupo "${chatName}": \n\n${textMessages}.
`;

/**
 * Respostas automáticas para primeira interação do usuário.
 * O bot escolhe uma dessas respostas de forma aleatória.
 * @type {string[]}
 */
const firstInteractionMessages = [
    '🌸✨ Olá! Eu sou a AdaBot, sua assistente favorita. Estou aqui para ajudar! Use /start para ver minhas opções, /resume para resumir conversas e /sticker para criar figurinhas. Vamos começar? 😊',
    '💖🌟 Oiê! Eu sou a AdaBot. Que tal usar /start para ver o que posso fazer? Também tenho /resume para resumir mensagens e /sticker para criar figurinhas. Estou aqui para ajudar! 😉',
    '✨🌸 Olá! Eu sou a AdaBot. Use /start para ver meus comandos, /resume para resumir conversas e /sticker para transformar imagens em figurinhas. Como posso ajudar hoje? 💕',
    '🌟💖 Oi! Eu sou a AdaBot. Que tal começar com /start para ver minhas funções? Também posso resumir conversas com /resume e criar figurinhas com /sticker. Vamos lá! 😊',
    '🌸💫 Olá! Eu sou a AdaBot. Use /start para explorar minhas opções, /resume para resumir mensagens e /sticker para criar figurinhas. Estou aqui para ajudar! 💖',
    '💫🌸 Oiê! Eu sou a AdaBot. Que tal usar /start para ver o que posso fazer? Também tenho /resume para resumir conversas e /sticker para criar figurinhas. Vamos começar? 😉',
    '✨💖 Olá! Eu sou a AdaBot. Use /start para ver meus comandos, /resume para resumir mensagens e /sticker para transformar imagens em figurinhas. Como posso ajudar hoje? 💕',
    '💖✨ Oi! Eu sou a AdaBot. Que tal começar com /start para ver minhas funções? Também posso resumir conversas com /resume e criar figurinhas com /sticker. Vamos lá! 😊',
    '🌸🌟 Olá! Eu sou a AdaBot. Use /start para explorar minhas opções, /resume para resumir mensagens e /sticker para criar figurinhas. Estou aqui para ajudar! 💖',
    '🌟🌸 Oiê! Eu sou a AdaBot. Que tal usar /start para ver o que posso fazer? Também tenho /resume para resumir conversas e /sticker para criar figurinhas. Vamos começar? 😉',
    '💫💖 Olá! Eu sou a AdaBot. Use /start para ver meus comandos, /resume para resumir mensagens e /sticker para transformar imagens em figurinhas. Como posso ajudar hoje? 💕',
    '✨🌟 Oeeee! Eu sou a AdaBot. Que tal começar com /start para ver minhas funções? Também posso resumir conversas com /resume e criar figurinhas com /sticker. Vamos lá! 😊',
];

module.exports = {
    botResponses,
    sendStickerErrors,
    rejectCallResponses,
    firstInteractionMessages,
    groupPrompt,
};
