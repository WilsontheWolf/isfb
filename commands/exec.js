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
        .setFooter(`exec command executed by ${message.author.username}`)
        .setTimestamp();
    let timeout = 5000;
    if (message.flags.includes('l')) {
        timeout = 60000;
	  }
    if (message.flags.includes('d')) {
        message.delete().catch(O_o =>{});
	  }

    require('child_process')
        .exec(args.join(' '), {timeout},
            (err, stdout, stderr) => {
                let e = !!stderr;
                let result = stdout && stderr ? `Stdout:\n${stdout}\nStderr:\n${stderr}`: stdout || stderr;
                embed.setTitle(e ? '**Error**' : '**Success**')
                    .setColor(e ? 'RED' : 'GREEN')
                    .setDescription(`\`\`\`${result.substr(0, 4090)}\`\`\``);
                if (result.length >= 4097) {
                    console.log(`An exec command executed by ${message.author.username}'s response was too long \(${result.length}/4096\) the response was:
				${result}`);
                    embed.addField(
                        'Note:',
                        `The response was too long with a length of \`${result.length}/4096\` characters. it was logged to the console`
                    );
                }
                message.channel.send(embed);
            });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Bot Owner',
    hidden: true
};

exports.help = {
    name: 'exec',
    category: 'System',
    description: 'run system commands.',
    usage: 'exec [command]'
};
