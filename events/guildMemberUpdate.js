const Discord = require('discord.js')
module.exports = async (client, oldMember, newMember) => {
	if (!client.crystals.has(oldMember.id)) return
	const cooldowns = {
		'708466256906551306': 'Bronze',
		'708466312380284998': 'Silver',
		'708466330998931487': 'Gold',
		'708466350976270386': 'Diamond',
		'708466368273449012': 'Crystal',
		'708466395112800386': 'Dev'
	}
	let o = oldMember.roles.filter(r => cooldowns[r.id])
	let n = newMember.roles.filter(r => cooldowns[r.id])
	o.sweep(r => n.has(r.id))
	updated = o.map(r => cooldowns[r.id])
	if (updated.length < 1) return
	oldMember.send(
		new Discord.RichEmbed()
			.setTitle('Cooldown Ended!')
			.setDescription(`Hey <@${oldMember.id}>, your ${updated.join(', ')} crystal${updated.length === 0 ? 's' : ''} ${updated.length === 0 ? 'are' : 'is'} off cooldown.`)
			.setFooter('To unsubscribe to these messages, send "-cooldown".')
	)
};
