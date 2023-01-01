require('dotenv').config();
const Bot = require('@projectdysnomia/dysnomia');
const config = require('./config.js');
const { readdir } = require('node:fs/promises');
const { loadCommand, setClient, loadComponent } = require('./modules/functions');

/** @type {Bot.Client} */
const client = new Bot(config.token, {
    allowedMentions: {
        users: false,
        roles: false,
        repliedUser: true,
        everyone: false,
    },
    gateway: {
        intents: ['guilds', 'guildMessages', 'directMessages']
    },
});

setClient(client);

const init = async () => {
    // Load commands
    const cmdFiles = await readdir('./commands/');
    console.log(`Loading a total of ${cmdFiles.length} commands.`);
    cmdFiles.forEach(f => {
        if (!f.endsWith('.js')) return;
        const response = loadCommand(f);
        if (response) console.log(response);
    });

    // Load components
    const compFiles = await readdir('./components/');
    console.log(`Loading a total of ${compFiles.length} components.`);
    compFiles.forEach(f => {
        if (!f.endsWith('.js')) return;
        const response = loadComponent(f);
        if (response) console.log(response);
    });

    // Load Events
    const evtFiles = await readdir('./events/');
    console.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split('.')[0];
        console.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);

        client.on(eventName, async (...args) => {
            try {
                await event(client, ...args);
            } catch (e) {
                console.error('Error running event', eventName, e);
            }
        });
    });
    // Login
    await client.connect()
        .catch(err => {
            console.log(err);
            process.exit(1);
        });
};

init();
