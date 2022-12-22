const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
    await message.reply('Bot is shutting down.');
    client.commands.forEach(async cmd => {
        await client.unloadCommand(cmd);
    });
    process.exit(1);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Bot Admin',
    hidden: true
};

exports.help = {
    name: 'reboot',
    category: 'System',
    description:
    'Shuts down the bot. If running under PM2, bot will restart automatically.',
    usage: 'reboot'
};
