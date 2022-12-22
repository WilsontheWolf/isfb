const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
    let botMessage = message.cleanContent
        .slice(message.settings.prefix)
        .trim()
        .split(' ');
    botMessage.shift();
    botMessage = botMessage.join(' ');
    message.delete().catch(O_o => {});
    message.channel.send(botMessage);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Bot Admin',
    hidden: true
};

exports.help = {
    name: 'say',
    category: 'Miscelaneous',
    description: 'It like... Pings. Then Pongs. And it\'s not Ping Pong.',
    usage: 'ping'
};
