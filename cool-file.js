
module.exports = async (client, message) => {
	channel = message.guild.channels.find(c => c.name == 'mod-logs')
	const embed = new Discord.RichEmbed()
		.setTitle("Message Delete")
		.setDescription(`Author: ${message.author} (\`${message.author.id}\`)\
Channel: ${message.channel} (\`${message.channel.id}\`)
Meessage Content:\n\`${message.content}\``)
		.setColor('GREYPLE')
		.setFooter(`Message ID: {message.id}`)
		.setTimestamp()
		channel.send(embed)
};