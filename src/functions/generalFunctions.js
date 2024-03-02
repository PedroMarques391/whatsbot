/**
 * @description Transforma uma imagem em figurinha.
 * @param {WAWebJS.Message} msg Chat do grupo em questão.
 * @param {Client} client Chat do grupo em questão.
 */
async function makeSticker(msg, client) {
  if (msg.type !== 'image') {
    await msg.reply(`O comando '${msg.body}' deve vir como legenda de uma imagem.`);
    return;
  }

  const media = await msg.downloadMedia();
  await msg.reply('Fazendo figurinha, aguarde....');
  client.sendMessage(msg.from === '559185480955@c.us' ? msg.to : msg.from, media, {
    sendMediaAsSticker: true,
    stickerName: '💀Created by',
    stickerAuthor: 'HasturBot💀',
  });
}

module.exports = {
  makeSticker,
};
