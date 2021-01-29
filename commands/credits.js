const Discord = require('discord.js');
const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('Credits')
        .setDescription('The wonderful people who made this happen.')
        .addField(
            'Owner and Original Idea',
            'WilsontheWolf#0074 started the idea and helped make it a reality.'
        )
        .addField(
            'Code',
            'Super special thanks to Chicken#4127 and Khoo Hao Yit#6191 for helping code many things to make this work.'
        )
        .addField(
            'Special thanks',
            'jwiggs#4655 for making the game for this, and adding the bot to the official IIOW server.'
        )
        .setColor('RANDOM');
    message.channel.send(embed);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'User',
    hidden: false
};

exports.help = {
    name: 'credits',
    category: 'System',
    description: 'Who made who?',
    usage: 'credits'
};
