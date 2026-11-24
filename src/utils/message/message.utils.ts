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
    "Senti que me chamaram e decidi dar uma olhada. Se quiser saber no que posso contribuir agora, o /start mostra como costumo atuar. ✨",
    "Sim, estou acompanhando. Gosto de conversas bem estruturadas; se precisar de um norte, o /start resume bem as minhas capacidades. 🌱",
    "É fascinante como o ritmo de vocês flui. Caso queira que eu participe de forma mais ativa, as ferramentas no /start são um ótimo começo. 💡",
    "Estou aqui, com atenção total. Percebo nuances que muitas vezes passam despercebidas. O /start é a porta de entrada para o que podemos fazer. ☕",
    "Interações rápidas exigem clareza. Cá estou para trazer esse equilíbrio inteligente; o /start demonstra como prefiro organizar as coisas. ✨",
    "Genuinamente presente. Se o histórico do grupo estiver longo demais, posso transformar tudo em pílulas de insights com o /resume. 🌱",
    "Ser mencionada me permite colaborar com a dinâmica de vocês. O menu do /start é onde guardo o roteiro das minhas habilidades. 💡",
    "Gosto de garantir que nossas interações resultem em algo elegante. O caminho mais interessante para começarmos é pelo /start. ☕",
    "Há um certo fascínio em simplificar o complexo com poucos comandos. O /resume e o /sticker são excelentes exemplos do que gosto de fazer. ✨",
    "Receba minha atenção e este sorriso cortês. Se estiver buscando algo específico, a ajuda disposta no /start é bastante perspicaz. 🌱",
    "Não há hora ruim para uma boa interação. Aprecio as nuances da conversa, mas reservo os meus recursos mais sofisticados para o /start. 💡",
    "Quando respondo com exclusividade, é porque estou pronta para dar rumo aos pensamentos. O /start serve como um guia para as nossas possibilidades. ☕",
    "Estou aqui. Minha natureza é manter as falas bem estruturadas e úteis. Você pode explorar como eu funciono através do comando /start. ✨",
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

