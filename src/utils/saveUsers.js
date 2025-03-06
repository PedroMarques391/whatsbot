/* eslint-disable indent */
const fs = require('fs');

let usersResponded = new Set();
(function reloaduser() {
    if (fs.existsSync('users.json')) {
        const data = fs.readFileSync('users.json');
        usersResponded = new Set(JSON.parse(data));
    }
}());

/**
 * Salva a lista de usuários que responderam em um arquivo JSON.
 * O arquivo é nomeado 'users.json' e é salvo no diretório de trabalho atual.
 * A lista de usuários é convertida para uma string JSON antes de ser escrita no arquivo.
 *
 */
function saveUsers() {
    fs.writeFileSync('users.json', JSON.stringify([...usersResponded]));
}

module.exports = {
    saveUsers,
    usersResponded,
};
