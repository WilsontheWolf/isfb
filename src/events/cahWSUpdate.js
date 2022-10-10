const WebSocket = require('ws');

module.exports = async (client, id) => {
    const data = await client.wsGenData(id);
    client.iajWSS.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN && ws.code === id) {
            ws.send(data);
        }
    });
};