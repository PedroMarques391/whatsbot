/**
 * @description Separa oo texto do comando.
 */
function extractTextFromBody(body) {
    const words = body.split(' ');
    words.shift();
    return words.join(' ').trim();
}

/**
 * Pausa a execução por um período de tempo especificado.
 *
 * @param {number} ms - O número de milissegundos para aguardar.
 * @returns {Promise<void>} Uma Promise que é resolvida após o tempo especificado.
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
    extractTextFromBody,
    delay,
};
