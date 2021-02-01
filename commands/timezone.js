const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
    const subCommands = [
        {
            default: true,
            names: ['get', 'view'],
            level: 0,
            run: async (args) => {
                if (!args[0]) return message.reply(`Please specify a user or use a valid sub command. For more info run \`${message.settings.prefix}help time\``);
                let user = await client.fetchUser(args.join(' '), message);
                if (!user) return message.reply('User not found.');
                let data = await client.times.get(user.id);
                if (!data) return message.reply('This user doesn\'t have any data.');
                let { offset, bedtime } = data;
                if (isNaN(offset)) return message.reply('This user doesn\'t have any data.');
                let date = new Date(Date.now() + (offset * 60 * 60 * 1000));
                let time = date.getUTCHours() + date.getUTCMinutes() / 60;
                message.channel.send(`For ${user.username} it is currently \`${client.getTime(time)}\`.
Their offset it UTC ${offset}.
${bedtime ? client.pastBedtime(...bedtime, time) ? `It's past ${user.username}'s set bedtime.` : '' : ''}`);
            }
        },
        {
            default: false,
            names: ['set', 'edit'],
            level: 0,
            run: async (args) => {
                let time = Number(args[0]);
                if(time === 'none') {
                    await client.times.ensure(message.author.id, {
                        offset: null,
                        bedtime: null,
                        lastAlert: 0
                    });
                    await client.times.set(`${message.author.id}.offset`, null);
                    return message.reply('I have cleared your time offset.');
                }
                if (isNaN(time)) return message.reply('Please supply a valid offset.');
                await client.times.ensure(message.author.id, {
                    offset: null,
                    bedtime: null,
                    lastAlert: 0
                });
                await client.times.set(`${message.author.id}.offset`, time);
                message.reply(`I have set your offset as UTC ${time}`);
            }
        },
        {
            default: false,
            names: ['setBedtime', 'bedtime'],
            level: 0,
            run: async (args) => {
                if (args[0] === 'none') {
                    await client.times.ensure(message.author.id, {
                        offset: null,
                        bedtime: null,
                        lastAlert: 0
                    });
                    await client.times.set(`${message.author.id}.bedtime`, null);
                    return message.reply('I have cleared your time bedtime.');
                }
                let start;
                try {
                    start = client.parseTime(args[0]);
                } catch (e) {
                    return message.reply(`Error parsing start time: ${e}`);
                }
                let end;
                try {
                    end = client.parseTime(args[1]);
                } catch (e) {
                    return message.reply(`Error parsing end time: ${e}`);
                }
                if (isNaN(start) || isNaN(end)) return message.reply('Please supply a valid start and end time.');
                await client.times.ensure(message.author.id, {
                    offset: null,
                    bedtime: null,
                    lastAlert: 0
                });
                await client.times.set(`${message.author.id}.bedtime`, [start, end]);
                message.reply(`I have set your bedtime to ${client.getTime(start)}-${client.getTime(end)}`);
            }
        }
    ];
    const subCommand = args.shift();
    let command = subCommands.find((v) => v.names.includes(subCommand));
    if (!command) {
        command = subCommands.find((v) => v.default);
        args.unshift(subCommand);
    }
    if (!command || !command.run || typeof command.run !== 'function') throw new Error('Unable to run command!');
    if (command.level > level) return 'You don\'t have the perms to run this subcommand!';
    command.run(args);


};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['time'],
    permLevel: 'User',
    hidden: false
};

exports.help = {
    name: 'timezone',
    category: 'Miscelaneous',
    description: 'Timezone talk.',
    usage: `timezone get [user]
timezone set [UTC offset or \`none\`]
timezone bedtime [bedtime start or \`none\`] [bedtime end]
`
};
