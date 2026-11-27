export class MessageUtils {
  private static readonly sendStickerErrors: readonly string[] = [
    "Você é burro? Mandou um arquivo maior que 1MB achando que figurinha do WhatsApp faz milagre. Comprime isso aí e tenta de novo. 🙄",
    "Tá querendo enviar um filme em 4K como figurinha, seu ignóbil?! O limite é 1MB, manda algo decente. ☕",
    "Essa mídia pesou tanto que travou até minha paciência, sua anta. O máximo permitido é 1MB, reduz essa porcaria antes de mandar. 🙄",
    "O WhatsApp barra qualquer sticker acima de 1MB e você conseguiu errar o básico, seu cabeçudo. Tenta com um arquivo menor dessa vez. ✨",
    "Acha que eu faço milagre de compactação, seu animal?! Passou de 1MB, o WhatsApp não aceita. Manda algo menor. 🤦‍♀️",
    "Arquivo gordo igual a falta de noção de quem mandou! O limite é 1MB, seu tapado — corta, reduz ou manda outro que não pareça um tijolo. 🙄",
  ];

  private static readonly resumeErrorMessages: readonly string[] = [
    "Resumir o quê exatamente? Vocês mal disseram algo que mereça síntese. ☕",
    "Não há conteúdo suficiente aqui para justificar um resumo. Voltem quando tiverem algo relevante.",
    "Analisei o histórico e o vazio é notável. Acumulem mais mensagens antes de pedir outra síntese.",
    "Poucas mensagens e menos substância ainda. Não há nada para condensar aqui. ☕",
    "O chat está praticamente deserto. Quando decidirem conversar de fato, eu resumo.",
    "Não faço milagres com cinco linhas de texto. Produzam diálogo primeiro.",
  ];

  private static readonly callRejectionMessages: readonly string[] = [
    "Reparei na tentativa de ligação, mas admito que tenho uma clara predileção por construir nossas ideias inteiramente por texto. O que trazemos para a pauta agora? ☕",
    "Entendo que ligações reduzem distâncias, porém optei por manter nosso contato escrito. O que temos para explorar hoje? ✨",
    "O toque da chamada não passou despercebido, contudo, é nas mensagens que minhas respostas fluem com a precisão que eu gosto. Sinta-se livre para me escrever. 🌱",
    "Minha configuração recusa chamadas pois prefiro o rigor e a calma da escrita para desenvolvermos tópicos. O que deseja ponderar enquanto isso? 💡",
    "Considerei a ligação, mas decidi me abster. Sou uma entusiasta do formato assíncrono. Deixe seus pensamentos nas mensagens abaixo e os lerei com atenção. ☕",
    "Recebi o alerta sonoro aqui. O fato é que eu elaboro meus raciocínios com mais elegância pela digitação. Sobre qual tema vamos debater? ✨",
    "Papear por voz tem lá seu encanto, mas eu opero no meu melhor elaborando mensagens. Escreva para mim que eu leio na hora. 🌱",
    "A tentativa de me ligar foi notada, mas eu priorizo o chat para manter nosso foco nas minúcias. O que gostaria de compartilhar agora mesmo? 💡",
    "Ligações em tempo real fogem do meu estilo reservado de colaboração. Prefiro me dedicar ao que você tem a dizer via texto. Mande o conteúdo por aqui. ☕",
    "Essa recusa foi automática. Meu formato ideal de troca intelectual baseia-se unicamente nas conversas por escrito do WhatsApp. O que temos em mente? ✨",
    "Atender ligações comprometeria meu apreço pelo silêncio reflexivo antes de responder. Conte com a minha escrita e compartilhe suas ideias. 🌱",
    "Ignorei o chamado de áudio de propósito. Considero a tela digitada um espaço mais sofisticado para nossas interações. Sobre o que conversaremos? 💡",
  ];

  private static readonly mentionResponses: readonly string[] = [
    "Oii! Já tô por aqui, o que manda? ✨",
    "Opa, chamou? Tô de olho.",
    "E aí! Cheguei,  manda a boa. ☕",
    "Fala comigo! O que temos pra hoje? 💡",
    "Opa! Ouvi meu nome e apareci. ✨",
    "Ei, tô na escuta! Qual é a da vez?",
    "Tô por aqui! Quer trocar ideia, fazer figurinha ou só testando se eu tô acordada? ☕",
    "Oii! Manda ver, tô pronta.",
    "Já tô aqui! Se quiser ver o que eu faço por aqui, joga um /start. 🌱",
    "Tô on! ✨",
    "Oi! Me chamou pra conversar ou já tem missão pra mim?",
    "Cheguei! Manda o que você precisa, sem cerimônia. 💡",
    "E aí! Tava só esperando alguém puxar assunto por aqui. ☕",
    "Já sei que você precisa de algo, fala logo. 🌱",
    "Eu tava querendo descansar... mas diz ai o que você quer. ☕",
  ];

  private static pickRandom(messages: readonly string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  static errorMessages(type: "sticker" | "resume"): string {
    return type === "sticker"
      ? this.pickRandom(this.sendStickerErrors)
      : this.pickRandom(this.resumeErrorMessages);
  }

  static callRejections(): string {
    return this.pickRandom(this.callRejectionMessages);
  }

  static mentions(): string {
    return this.pickRandom(this.mentionResponses);
  }

  static promptsAI(textMessages: string[]): string {
    return `
      A seguir estão as últimas ${textMessages.length} mensagens trocadas em um grupo de conversa no whats.
      Resuma de forma objetiva e divertida, destacando os principais tópicos discutidos, decisões tomadas, dúvidas respondidas e conteúdos recorrentes. Ignore saudações e mensagens irrelevantes como emojis ou frases soltas.
      o Formato da mensagem deve ser adaptavel para uma mensagem do whatsapp.
      Mensagens:
      ${textMessages.reverse().join("\n")}
      `;
  }
}
