const WebSocket = require('ws');

module.exports = async (client, game, reason, scores) => {
    const data = JSON.stringify({
        type: 'end',
        scores,
        reason,
        round: game.round
    });
    client.iajWSS.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN && ws.code === game.id) {
            ws.send(data);
            ws.close(1000, 'Game over');
        }
    });
};