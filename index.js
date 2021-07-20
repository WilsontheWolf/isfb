// Throw error on outdated node
if (Number(process.version.slice(1).split('.')[0]) < 12)
    throw new Error(
        'Node 12.0.0 or higher is required. Update Node on your system.'
    );

// Require all the things!
require('dotenv').config();
const Discord = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const Josh = require('@joshdb/core');
const provider = require('@joshdb/sqlite');
const express = require('express');
const WebSocket = require('ws');

// Start express server
const app = express();
const server = app.listen(process.env.PORT);
app.use(express.static(__dirname + '/views'));

// Make the client
const client = new Discord.Client();

// Manage WS server for IAJ
const wss = new WebSocket.Server({ noServer: true });
client.iajWSS = wss;

server.on('upgrade', (request, socket, head) => {
    const match = request?.url?.match(/^\/iaj\/(\w+)/);
    if (!match) {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
        return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, { ...request, iajCode: match[1] });
    });
});
wss.on('connection', async (ws, { iajCode }) => {
    const send = (msg) => {
        if (typeof msg !== 'string') msg = JSON.stringify(msg);
        ws.send(msg);
    };
    if (!iajCode) {
        send({
            type: 'fatal',
            message: 'Invalid code'
        });
        ws.close(1008, 'Invalid code');
        return;
    }
    ws.code = iajCode;
    if (!(await client.games.has(iajCode))) {
        send({
            type: 'fatal',
            message: 'Invalid code'
        });
        ws.close(1008, 'Invalid code');
        return;
    }
    ws.on('message', async (message) => {
        try {
            let msg = JSON.parse(message);
            if (msg.type === 'update') {
                send(await client.wsGenData(iajCode));
            }
            else {
                send({
                    type: 'debug',
                    message: `Invalid type sent "${msg.type}"`
                });
            }
        } catch (e) {
            console.error('Invalid client msg!', message, '\nError:', e);
            send({
                type: 'debug',
                message: `Invalid client msg! ${message}`,
            });
        }
    });
    ws.on('close', () => {
        // idk
    });
    send(await client.wsGenData(iajCode));
    await client.wait(2000);
    send({
        type: 'info',
        message: 'Note this is a beta version'
    });
});

// load stuffs
client.config = require('./config.js');

client.logger = require('./modules/Logger');

require('./modules/functions.js')(client);

// commands and stuff
client.commands = new Enmap();
client.aliases = new Enmap();

// db's
Object.assign(client, Enmap.multi(['settings', 'internal']));

client.cards = new Josh({
    name: 'cards',
    provider
});

client.games = new Josh({
    name: 'games',
    provider
});

client.crystals = new Josh({
    name: 'crystals',
    provider
});

client.times = new Josh({
    name: 'times',
    provider
});

const init = async () => {
    // Load commands
    const cmdFiles = await readdir('./commands/');
    client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(f => {
        if (!f.endsWith('.js')) return;
        const response = client.loadCommand(f);
        if (response) console.log(response);
    });
    // Load Events
    const evtFiles = await readdir('./events/');
    client.logger.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split('.')[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);

        client.on(eventName, event.bind(null, client));
    });
    // Level cache
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
    // Login
    client.login(client.config.token);
};

init();
