const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = (client, message, args, level) => {
    if (!args[0]) {
        const myCommands = message.guild
            ? client.commands.filter(
                cmd => client.levelCache[cmd.conf.permLevel] <= level
            )
            : client.commands.filter(
                cmd =>
                    client.levelCache[cmd.conf.permLevel] <= level &&
            cmd.conf.guildOnly !== true
            );

        const commandNames = myCommands.keyArray();
        const longest = commandNames.reduce(
            (long, str) => Math.max(long, str.length),
            0
        );

        let currentCategory = '';
        let output = `= Command List =\n\n[Use ${message.settings.prefix}help <commandname> for details and how to use.]\n`;
        const sorted = myCommands
            .array()
            .sort((p, c) =>
                p.help.category > c.help.category
                    ? 1
                    : p.help.name > c.help.name && p.help.category === c.help.category
                        ? 1
                        : -1
            );
        sorted.forEach(c => {
            if (c.conf.hidden) return;
            const cat = c.help.category.toProperCase();
            if (currentCategory !== cat) {
                output += `\u200b\n== ${cat} ==\n`;
                currentCategory = cat;
            }
            output += `${message.settings.prefix}${c.help.name}${' '.repeat(
                longest - c.help.name.length
            )} :: ${c.help.description}\n`;
        });
        message.channel.send(output, {
            code: 'asciidoc',
            split: { char: '\u200b' }
        });
    } else {
        let command = args[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            if (level < client.levelCache[command.conf.permLevel]) return;
            message.channel.send(
                `= ${command.help.name} = \n${command.help.description}\nusage:: ${
                    command.help.usage
                }\naliases:: ${command.conf.aliases.join(', ')}\n= ${
                    command.help.name
                } =`,
                { code: 'asciidoc' }
            );
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h', 'halp'],
    permLevel: 'User',
    hidden: false
};

exports.help = {
    name: 'help',
    category: 'Help',
    description: 'Displays all the available commands for your permission level.',
    usage: 'help [command]'
};
