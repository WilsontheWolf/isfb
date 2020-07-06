const Discord = require('discord.js')
exports.run = async (client, message, args, level) => {
	const embed = new Discord.RichEmbed()
	.setFooter(`exec command executed by ${message.author.username}`)
	.setTimestamp()
	let timeout = 5000
	if (message.flags.includes("l")) {
		timeout = 60000
	  }
	if (message.flags.includes("d")) {
		message.delete().catch(O_o =>{});
	  }

	require("child_process")
		.exec(args.join(' '), {timeout},
			(err, stdout, stderr) => {
				let e = !!stderr
				let result = stdout || stderr
				embed.setTitle(e ? '**Error**' : '**Success**')
					.setColor(e ? 'RED' : 'GREEN')
					.setDescription(`\`\`\`${result.substr(0, 2042)}\`\`\``)
				if (result.length >= 2049) {
					console.log(`An exec command executed by ${message.author.username}'s response was too long \(${result.length}/2048\) the response was:
				${evaled}`);
					embed.addField(
						"Note:",
						`The response was too long with a length of \`${result.length}/2048\` characters. it was logged to the console`
					);
				}
				message.channel.send(embed)
			});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: "Bot Owner",
	hidden: true
};

exports.help = {
	name: "exec",
	category: "System",
	description: "run system commands.",
	usage: "exec [command]"
};
