const count = (str) => {
	const re = /\({0,1}_+\){0,1}/g
	return ((str || '').match(re) || []).length
}

function getCard(id,client, type = 'white') {
	let cards = client.game.get(id, type)
	if (!cards) return;
	let value = client.Rnd(0, cards.length)
	let card = cards[value]
	client.game.set(id, cards.filter((c, i) => i != value), type)
	return card
  }

module.exports = async (client, msg) => {
	if (msg.content.startsWith('-')) return;
	let game = client.game.find(g => g.players[msg.author.id])
	console.log(game)
	if (!game) return
	player = game.players[msg.author.id]
	if (!player.enabled) return msg.reply(`You currently are in a game but not participating.
If you want to rejoin the game run the command \`-iaj join ${game.id}\``)
	c = count(game.curBlack.value)
	if (msg.content == 'leave') {
		client.game.set(game.id, false, `players.${msg.author.id}.enabled`);
		msg.reply('You have left this game.')
	} else {
		const args = msg.content
			.trim()
			.split(/ +/g);
		if (game.state == 'picking' && game.czar != msg.author.id && player.selected[0]) {
			let sub = []
			for (let i = 0; i < c; i++) {
				let num = parseInt(args[i])
				if(isNaN(num)) i = c
				else if(num > player.cards.size || num < 1) i = c
				else if(sub.includes(num)) i = c
				else sub.push(num)
			}
			if(sub.length != count) return msg.reply(`Please choose \`${c}\` valid choices.`)
			sub.forEach(s => {
				player.selected.push(player.cards[s])
				player.cards.splice(s - 1, 1) 
				player.cards.push(getCard(id, client, 'white'))
			})
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
