const Discord = require('discord.js');
const { Client, Message } = require('discord.js');

const bedtime = async (message) => {
    let data = await message.client.times.get(`${message.author.id}`);
    if (!data) return;
    let { offset, bedtime, lastAlert } = data;
    if (isNaN(offset) || !Array.isArray(bedtime)) return;
    if (Date.now() - lastAlert < 600000) return;
    let date = new Date(Date.now() + (offset * 60 * 60 * 1000));
    let time = date.getUTCHours() + date.getUTCMinutes() / 60;
    let newAlert = Date.now();
    if (!message.client.pastBedtime(...bedtime, time)) return;
    message.author.send(`Hey ${message.author}, It's past your set bedtime (\`${message.client.getTime(time)}\`)! Make sure your getting enough sleep!`)
        .catch(() =>
            message.channel.send(`Hey ${message.author}, It's past your set bedtime (\`${message.client.getTime(time)}\`)! Make sure your getting enough sleep!`)
                .catch(() => { newAlert = lastAlert; })
        );
    message.client.times.set(`${message.author.id}.lastAlert`, newAlert);
};

/**
 * Message Event
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    // Prevent botception 
    if (message.author.bot) return;
    // Tell people who need to go to sleep to go to sleep.
    bedtime(message);
    // Get settings
    const settings = (message.settings = client.getSettings(message.guild) || client.settings.get('default'));
    // Prefix mention 
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
        return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
    }
    // Make sure the prefix is used
    if (message.content.indexOf(settings.prefix) !== 0)
        return client.emit('cahMsg', message);
    // Make sure the member exists
    if (message.guild && !message.member)
        await message.guild.fetchMember(message.author);
    // Args
    const args = message.content
        .slice(settings.prefix.length)
        .trim()
        .split(/ +/g);
    // Get the command
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // Get the level
    const level = client.permlevel(message);
    // Ensure the command can be used
    if (!cmd) return;
    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send(
            'This command is unavailable via private message. Please run this command in a guild.'
        );
    if (client.config.blocked.includes(message.author.id))
        return message.channel.send(
            `I'm sorry, ${message.author.tag}, you are blocked from using commands!`
        );
    if (level < client.levelCache[cmd.conf.permLevel]) {
        if (settings.systemNotice === 'true') {
            return message.channel
                .send(`You do not have permission to use this command.
Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
        } else {
            return;
        }
    }
    message.author.permLevel = level;
    // Flags
    message.flags = [];
    while (args[0] && args[0][0] === '-')
        message.flags.push(args.shift().slice(1));
    client.logger.cmd(
        `[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username
        } (${message.author.id}) ran command ${cmd.help.name}`
    );
    try {
        // Run the command
        await cmd.run(client, message, args, level);
    } catch (error) {
        // Catch errors
        console.error(error);
        const embed = new Discord.MessageEmbed()
            .addField(
                '<a:WeeWoo:525000522932027393>**__ERROR__**<a:WeeWoo:525000522932027393>',
                'Something went wrong while trying to execute that command. Please contact <@517371142508380170> for help.'
            )
            .addField('Error message:', `\`\`\` ${error}\`\`\``)
            .setColor('RED')
            .setTimestamp()
            .setFooter(`${client.user.username} error message`);
        message.channel.send(embed);
    }
};
