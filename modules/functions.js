const Enmap = require('enmap');

/** @type {import('eris').Client} */
let client;

const setClient = (c) => {
    client = c;
};

const commands = new Enmap();

const loadCommand = commandName => {
    try {
        console.log(`Loading Command: ${commandName}`);
        const props = require(`../commands/${commandName}`);
        commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
        return false;
    } catch (e) {
        return `Unable to load command ${commandName}: \n${e.stack}`;
    }
};

const unloadCommand = async commandName => {
    let command;
    if (commands.has(commandName)) {
        command = commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
        command = commands.get(client.aliases.get(commandName));
    }
    if (!command)
        return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
    if (command.shutdown) {
        await command.shutdown(client);
    }
    const mod = require.cache[require.resolve(`../commands/${commandName}`)];
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
        if (mod.parent.children[i] === mod) {
            mod.parent.children.splice(i, 1);
            break;
        }
    }
    return false;
};


module.exports = {
    loadCommand,
    unloadCommand,
    setClient,
    commands
}