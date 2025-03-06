/**
 * @description Retorna todos os participantes do grupo.
 */
function groupParticipants(chat) {
    const participants = [];
    for (const participant of chat.participants) {
        participants.push(`${participant.id.user}@c.us`);
    }
    return participants;
}

module.exports = {
    groupParticipants,
};
