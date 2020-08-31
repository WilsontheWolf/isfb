const Discord = require('discord.js')
module.exports = async (client, oldMember, newMember) => {
	if (!(await client.crystals.has(oldMember.id))) return
	const cooldowns = {
		'708466256906551306': 'bronze',
		'708466312380284998': 'silver',
		'708466330998931487': 'gold',
		'708466350976270386': 'diamond',
		'708466368273449012': 'crystal',
		'708466395112800386': 'dev'
	}
	let o = oldMember.roles.cache.filter(r => cooldowns[r.id])
	let n = newMember.roles.cache.filter(r => cooldowns[r.id])
	o.sweep(r => n.has(r.id))
	updated = o.map(r => cooldowns[r.id])
	if (!updated[0]) return
	oldMember.send(
		new Discord.MessageEmbed()
			.setTitle('Cooldown Ended!')
			.setDescription(`Hey <@${oldMember.id}>, your **${updated.join(', ')}** crystal${updated[1] ? 's' : ''} ${updated[1] ? 'are' : 'is'} off cooldown.`)
			.setFooter('To unsubscribe from these messages, send "-cooldown".')
			.setColor(o.first().color)
	)
};
