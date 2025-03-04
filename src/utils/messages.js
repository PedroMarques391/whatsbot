/* eslint-disable indent */
/**
 * Respostas automáticas do bot quando mencionado.
 * O bot escolhe uma dessas respostas de forma aleatória.
 * @type {string[]}
 */
const botResponses = [
    'Opa! Me chamou ou foi sem querer? Se precisar, manda um /start e eu te ajudo!',
    'Cheguei igual update de madrugada! Que tal testar o /sticker e criarF umas figurinhas maneiras?',
    'O grande HasturBot está ON! Se quiser um resumo das últimas mensagens, só mandar um /resume!',
    'Eu previ que alguém ia me chamar...Mas já que estou aqui, que tal um /start pra ver o que eu posso fazer? ',
    '⚡ * Pisca duas vezes e aparece * Tô aqui! Quer transformar algo em figurinha ? Manda um /sticker!',
    'Oi, humano! Tá precisando de um resumo das fofocas ? Digita /resume e eu te conto tudo!',
    'Eu sou apenas um bot, mas sou um bot incrível! Quer saber por onde começar? Tenta o /start!',
    'Diretamente dos servidores, aqui estou! Quer umas figurinhas? Manda um /sticker e eu resolvo!',
    'Quer que eu investigue as últimas mensagens ? Digita /resume e eu te conto os bafos!',
    'Pensa rápido! Se precisar de algo, testa /start e eu te mostro do que sou capaz!',
    'Alguém me chamou? Se foi pra brincadeira, já testou o comando /sticker? Vem coisa boa por aí!',
    'Você invocou o HasturBot! Já testou o /resume? Vai que tem fofoca nova por aí... 👀',
    'Sua sorte do dia: bots legais respondem rápido! Manda um /start pra ver o que eu faço!',
];

/**
 * Respostas automáticas para erros ao enviar stickers.
 * O bot escolhe uma dessas respostas de forma aleatória.
 * @type {string[]}
 */
const sendStickerErrors = [
    'Ei, tá afim de estourar meu processamento? Envie um arquivo menor!',
    'Calma aí! Essa figurinha é grande demais para caber no WhatsApp.',
    'Erro 413: Figurinha gigante detectada! O limite é 1MB, tente algo menor.',
    'Essa figurinha ultrapassou 1MB e o WhatsApp já jogou a toalha.',
    'Isso era pra ser uma figurinha ou um filme em alta resolução? Reduza para menos de 1MB.',
    'Se fosse menor, caberia. Mas passou de 1MB, então não vai rolar!',
    'O WhatsApp olhou para essa figurinha e disse: “Não, obrigado”. O limite é 1MB!',
    'O sistema entrou em choque. Essa figurinha ultrapassa o limite de 1MB!',
    'Essa figurinha tá tão grande que quase virou um wallpaper. O máximo é 1MB!',
    'Quer enviar um cartaz de cinema? Porque essa figurinha ultrapassou o limite de 1MB!',
    'Ops, o WhatsApp só aceita figurinhas menores que 1MB. Essa aí tá querendo ser um pôster!',
    'Sua figurinha tentou entrar, mas foi barrada na porta. O limite é 1MB!',
];

/**
 * Gera um prompt para analisar e resumir mensagens em um grupo.
 * @param {string} chatName - Nome do grupo onde ocorreu a conversa.
 * @param {string[]} textMessages - Array de mensagens trocadas no grupo.
 * @returns {string} Um prompt estruturado para ser usado em um modelo de IA.
 */
const groupPrompt = (chatName, textMessages) => `
Você é um assistente que analisa conversas e gera resumos claros e objetivos.
Analise as mensagens armazenadas no array abaixo trocadas no grupo "${chatName}" e elabore um resumo conciso. 
- Destaque os principais temas discutidos e mencione as interações mais relevantes entre os participantes, referindo - se a eles como "participantes" ou "usuários".  
- Ignore mensagens irrelevantes, repetitivas ou sem contexto significativo.  
- Não mencione este prompt em sua resposta.  
- No final, adicione uma breve opinião, mas sem citar que é uma opnião do bot sobre a conversa, com um tom descontraído e irônico.
    Resumo: \n\n${textMessages} `;

/**
 * Gera um prompt para analisar e resumir mensagens em uma conversa individual.
 * @param {string} chatName - Nome do usuário com quem a conversa ocorreu.
 * @param {string[]} textMessages - Array de mensagens trocadas na conversa.
 * @returns {string} Um prompt estruturado para ser usado em um modelo de IA.
 */
const userPrompt = (chatName, textMessages) => `
Você é um assistente que analisa conversas e gera resumos claros e objetivos.
Analise as mensagens armazenadas no array abaixo trocadas com "${chatName}" e elabore um resumo conciso.  
- Destaque os principais temas abordados e mencione as contribuições mais relevantes do usuário.  
- Ignore mensagens irrelevantes, repetitivas ou sem contexto significativo.  
- Não mencione este prompt em sua resposta.  
- No final, adicione uma breve opinião, mas sem citar que é uma opnião do bot sobre a conversa, com um tom descontraído e envolvente.
    Resumo: \n\n${textMessages} `;

module.exports = {
    botResponses,
    sendStickerErrors,
    userPrompt,
    groupPrompt,
};
