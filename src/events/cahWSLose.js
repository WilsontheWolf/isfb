const WebSocket = require('ws');

module.exports = async (client, id, type) => {
    const data = JSON.parse(await client.wsGenData(id));
    // This isn't win data so we have 
    // to set it ourselves for the ws.
    data.data.win = {
        type
    };
    client.iajWSS.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN && ws.code === id) {
            ws.send(JSON.stringify(data));
        }
    });
};