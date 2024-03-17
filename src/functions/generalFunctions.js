/**
 * @description Transforma uma imagem em figurinha.
 * @param {WAWebJS.Message} msg Chat do grupo em questão.
 * @param {Client} client Chat do grupo em questão.
 */
async function makeSticker(msg, client) {
  if (msg.type !== 'image') {
    return msg.reply(`O comando '${msg.body}' deve vir como legenda de uma imagem.`);
  }

  const media = await msg.downloadMedia();
  await msg.reply('Fazendo figurinha, aguarde....');
  client.sendMessage(msg.from === '559185480955@c.us' ? msg.to : msg.from, media, {
    sendMediaAsSticker: true,
    stickerName: '💀Created by',
    stickerAuthor: 'HasturBot💀',
  });
}

/**
 * @description Transforma uma imagem em figurinha.
 * @param {WAWebJS.Message} msg Chat do grupo em questão.
 * @param {WAWebJS.MessageMedia} MessageMedia Midia baixada.
 * @param {Client} client Chat do grupo em questão.
 */
async function sendAudios(msg, MessageMedia, client) {
  const chat = await msg.getChat();
  const audios = {
    '/01': 'assuma',
    '/02': 'audioEstourado',
    '/03': 'chipiChapa',
    '/04': 'danielFuiLa',
    '/05': 'eAHomosexualidade',
    '/06': 'fakenaty',
    '/07': 'feiopradesgraca',
  };
  const audio = audios[msg.body];
  if (msg.body && audio !== undefined) {
    const media = MessageMedia.fromFilePath(`./src/audios/${audio}.mp3`);
    await client.sendMessage(chat.id._serialized, media, { sendAudioAsVoice: true });
  } else {
    await msg.reply('Veja a lista outra vez e peça um aúdio válido.');
  }
}

module.exports = {
  makeSticker,
  sendAudios,
};
