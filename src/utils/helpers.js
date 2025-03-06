/**
 * @description Separa oo texto do comando.
 */
function extractTextFromBody(body) {
    const words = body.split(' ');
    words.shift();
    return words.join(' ').trim();
}

module.exports = {
    extractTextFromBody,
};
