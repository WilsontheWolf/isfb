const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
    if (!args[0]) {
        let cmds = client.commands.map(c => c.help.name);
        for(let i = 0; i < cmds.length;i++) await client.unloadCommand(cmds[i]);
        const cmdFiles = await readdir('./src/commands/');
        client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
        cmdFiles.forEach(f => {
            if (!f.endsWith('.js')) return;
            const response = client.loadCommand(f);
            if (response) console.log(response);
        });
        message.reply('Reloaded all commands.');
    } else {
        let cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        let response = await client.unloadCommand(cmd.help.name);
        if (response) return message.reply(`Error Unloading: ${response}`);

        response = client.loadCommand(cmd.help.name);
        if (response) return message.reply(`Error Loading: ${response}`);

        message.reply(`The command \`${cmd.help.name}\` has been reloaded`);
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['refresh'],
    permLevel: 'Bot Admin',
    hidden: true
};

exports.help = {
    name: 'reload',
    category: 'System',
    description: 'Reloads a command that"s been modified.',
    usage: 'reload [command]'
};
