const count = (str) => {
	const re = /\({0,1}_+\){0,1}/g
	return ((str || '').match(re) || []).length
}

async function getCard(id, client, type = 'white') {
	let cards = await client.games.get(id, type)
	if (!cards) return;
	let value = client.Rnd(0, cards.length)
	let card = cards[value]
	await client.games.set(`${id}.${type}`, cards.filter((c, i) => i != value))
	return card
}
const { Client, Message } = require("discord.js");
/**
 * Cards against humanity message handling Event
 * @param {Client} client
 * @param {Message} msg
 */
module.exports = async (client, msg) => {
	if (msg.content.startsWith('-')) return;
	let game = await client.games.find(g => g.players[msg.author.id])
	if (!game) return
	player = game.players[msg.author.id]
	if (!player.enabled) return msg.reply(`You currently are in a game but not participating.
If you want to rejoin the game run the command \`-iaj join ${game.id}\``)
	c = count(game.curBlack.value)
	if (msg.content == 'leave') {
		await client.games.set(`${game.id}.players.${msg.author.id}.enabled`, false, );
		msg.reply('You have left this game.')
	} else {
		const args = msg.content
			.trim()
			.split(/ +/g);
		if (game.state == 'picking' && game.czar != msg.author.id && player.selected[0]) {
			let sub = []
			for (let i = 0; i < c; i++) {
				let num = parseInt(args[i])
				if (isNaN(num)) i = c
				else if (num > player.cards.size || num < 1) i = c
				else if (sub.includes(num)) i = c
				else sub.push(num)
			}
			if (sub.length != count) return msg.reply(`Please choose \`${c}\` valid choices.`)
			for(let i = 0;i < sub.length;i++) {
				player.selected.push(player.cards[s])
				player.cards.splice(s - 1, 1);
				player.cards.push(await getCard(id, client, 'white'));
			}
			// {
			//   id: message.author.id,
			//   points: 0,
			//   selected: [],
			//   cards: [],
			//   faction
			// }
		};
	}
};
