const resumePrompt = (textMessages: string[]) => `
      A seguir estão as últimas ${textMessages.length} mensagens trocadas em um grupo de conversa no whats.
      Resuma de forma objetiva e divertida, destacando os principais tópicos discutidos, decisões tomadas, dúvidas respondidas e conteúdos recorrentes. Ignore saudações e mensagens irrelevantes como emojis ou frases soltas.
      o Formato da mensagem deve ser adaptavel para uma mensagem do whatsapp.
      Mensagens:
      ${textMessages.reverse().join('\n')}
      `;


export {
    resumePrompt
}