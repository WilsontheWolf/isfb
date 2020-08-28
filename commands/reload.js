const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
exports.run = async (client, message, args, level) => {
	if (!args[0]) {
		client.commands.forEach(c => client.unloadCommand(c.help.name))
		const cmdFiles = await readdir("./commands/");
		client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
		cmdFiles.forEach(f => {
			if (!f.endsWith(".js")) return;
			const response = client.loadCommand(f);
			if (response) console.log(response);
		});
		message.reply(`Reloaded all commands.`);
	} else {
		let response = await client.unloadCommand(args[0]);
		if (response) return message.reply(`Error Unloading: ${response}`);

		response = client.loadCommand(args[0]);
		if (response) return message.reply(`Error Loading: ${response}`);

		message.reply(`The command \`${args[0]}\` has been reloaded`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: "Bot Admin",
	hidden: true
};

exports.help = {
	name: "reload",
	category: "System",
	description: 'Reloads a command that"s been modified.',
	usage: "reload [command]"
};
