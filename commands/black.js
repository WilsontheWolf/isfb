
const submit = async (sub, msg) => {
    let cards = msg.client.cards;
    let internal = msg.client.internal;
    let dups = 0;
    for (let i = 0; i < sub.length; i++) {
        s = sub[i];
        if (!s) continue;
        if ((await check(s, cards))) {
            dups++;
            continue;
        }
        internal.inc('cardCount');
        await cards.set(internal.get('cardCount').toString(), {
            type: 'black',
            owner: msg.author.id,
            value: s
        });
    }
    return dups;
};
const check = async (sub, cards) => {
    let f = sub.toLowerCase().trim().replace(/_/g, '').replace(/\./g, '').replace(/\?/g, '').replace(/!/g, '');
    let exists = await cards.find(p => p.type == 'black' && p.value.toLowerCase().trim().replace(/_/g, '').replace(/\./g, '').replace(/\?/g, '').replace(/!/g, '') === f);
    return !!exists;
};
const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
    if (!args[0]) return message.reply('please put your submission.');
    let submissions = args.join(' ').split('\n');
    let r = await submit(submissions, message);
    let m = `I've submitted your card${submissions.length == 1 ? '' : 's'}.`;
    if (r) m = `${submissions.length == r ? 'all ' : ''}${r} ${submissions.length == 1 ? 'submisson' : 'of your submissions'} was flagged as a duplicate${r.length == 1 ? '' : 's'} and not submitted!`;
    if (submissions.length - r && r) m += ` I've submitted the other ${submissions.length - r} submission${submissions.length - r == 1 ? '' : 's'}.`;
    message.reply(m);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'User',
    hidden: false
};

exports.help = {
    name: 'black',
    category: 'Islands Against Jwiggs',
    description:
    'Submit a black card. Several can be submitted by seperating them with a new line.',
    usage: 'black [submissons]'
};
