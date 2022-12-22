const Discord = require('discord.js');
const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
const count = (str) => {
    const re = /\({0,1}_+\){0,1}/g;
    return ((str || '').match(re) || []).length;
};
exports.run = async (client, message, args, level) => {
    let user = message.author;
    let search;
    if (args[0]) search = await client.fetchUser(args.join(' '), message);
    if (search) user = search;
    let black = Object.values(await client.cards.filter(c => c.type == 'black'));
    let white = Object.values(await client.cards.filter(c => c.type == 'white'));
    let combos = 0;
    black.forEach(c => {
        combos += count(c.value) || 1;
    });
    combos = combos * white.length;
    const embed = new Discord.MessageEmbed()
        .setTitle('Card Stats')
        .addField('Total Cards:', await client.cards.size, true)
        .addField('Black Cards:', black.length, true)
        .addField('White Cards:', white.length, true)
        .addField('Unique Combos:', combos, true)
        .addField(`${user == message.author ? 'Your' : user.username + '\'s'} Cards:`, Object.keys(await client.cards.filter(c => c.owner == user.id)).length, true);
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
    name: 'cards',
    category: 'Islands Against Jwiggs',
    description: 'See how many cards there are for the server\'s IIslands Against Jwiggs competiton.',
    usage: 'ping'
};
