const funcs = {}
const Discord = require('discord.js')
exports.run = async (client, message, args, level) => {
	let games = client.game
	let cards = client.cards.filter(c => c.value)
	const count = (str) => {
		const re = /\({0,1}_+\){0,1}/g
		return ((str || '').match(re) || []).length
	}
	const genCode = (length = 5) => {
		let valid = false
		let characters = 'abcdefghijklmnopqrstuvwxyz';
		let result = ''
		while (!valid) {
			for (let i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * characters.length));
			}
			if (!games.has(result)) valid = true
		}
		return result
	}

	funcs.delete = function deletion(id) {
		if (id == 'count') return message.reply('invalid id.')
		let c = client.cards.get(id)
		if (!c) return message.reply('invalid id.')
		if (level < 5 && message.author.id != c.owner) return message.reply("you don't have the perms to use this sub-command.")
		client.cards.delete(id)
		message.reply(`Deleted card \`${id}\` with value \`${c.value}\``)
	}
	funcs.edit = function edit(id, type) {
		if (level < 5) return message.reply("you don't have the perms to use this sub-command.")
		type = type.toLowerCase()
		let a = Object.values(arguments)
		a.splice(0, 2)
		let value = a.join(' ')
		if (id == 'count') return message.reply('invalid id.')
		let c = client.cards.get(id)
		if (!c) return message.reply('invalid id.')
		if (!['value', 'owner', 'colour'].includes(type)) return message.reply('invalid type.')
		if (type == 'value') editValue(id, c, value)
		if (type == 'owner') editOwner(id, c, value)
		if (type == 'colour') editColour(id, c, value)
	}
	funcs.search = function search() {
		let q = Object.values(arguments)
		let cds = client.cards.filter(c => c.value && c.value.toLowerCase().includes(q.join(' ').toLowerCase()))
		if (!cds.size) return message.reply('no results found.')
		let r = cds.map((c, i) => `${i} ${client.users.has(c.owner) ? client.users.get(c.owner).tag : "Unknown User (" + c.owner + ")"} ${c.type}: ${c.value}`).join('\n')
		const embed = new Discord.RichEmbed()
			.setTitle('Results')
			.setDescription(`\`\`\`${r.substr(0, 2041)}${r.length > 2041 ? '…' : ''}\`\`\``)
		message.channel.send(embed)
	}
	funcs.info = function info(id) {
		if (id == 'count') return message.reply('invalid id.')
		let c = client.cards.get(id)
		if (!c) return message.reply('no such card.')
		const embed = new Discord.RichEmbed()
			.setAuthor(`Info for card ${id}`)
			.setTitle('Content:')
			.setDescription(c.value)
			.addField('Owner:', client.users.has(c.owner) ? client.users.get(c.owner).tag : "Unknown User (" + c.owner + ")", true)
			.addField('Type:', c.type, true)

		message.channel.send(embed)
	}
	funcs.create = function create() {
		if (level < 9) return message.reply("you don't have the perms to use this sub-command.")
		let size = games.count
		if (size >= 1) return message.reply('Sorry the maximum amount of games has been reached!')
		let white = cards.filterArray(c => c.type == 'white' && !c.value.includes('http'))
		let black = cards.filterArray(c => c.type == 'black' && count(c.value) < 3)
		let id = genCode()
		games.set(id, {
			id,
			owner: message.author.id,
			white,
			black,
			curBlack: null,
			players: {},
			czar: null,
			round: 0,
			state: 'waiting'
		})
		message.reply(`I've created your game. The code is \`${id}\`. To join type \`-iaj join ${id}\`.`)
	}
	funcs.start = function start(id) {
		let game = games.get(id)
		if (!game) return message.reply('No such game!')
		if (level < 9 && game.owner != message.author.id) return message.reply(`You don't have the permissions to start this game.`)
		if (Object.keys(game.players).size < 3) return message.reply("You don't have enough players to continue.")
		client.emit('cahStart', id)
		message.reply(`I've started your game.`)
	}
	funcs.join = function join(id) {
		if (games.find(g => g.players[msg.author.id])) return message.reply('You are already in a game.')
		let game = games.get(id)
		if (!game) return message.reply('No such game!')
		if (game.players[message.author.id] && game.players[message.author.id]) return message.reply("You're already in this game.")
		if (game.players[message.author.id] && !game.players[message.author.id]) {
			games.set(id, true, `players.${message.author.id}.enabled`)
			message.reply('You have re-joined the game. You can participate next round.')
			games.set(id, 'idk', `players.${message.author.id}.selected`)
		} else {
			let faction = client.getFaction(message.member || message.author)
			if (!client.getFaction(message.member || message.author)) return message.reply("You must be in a faction to join.")
			games.set(id, {
				id: message.author.id,
				points: 0,
				selected: null,
				cards: [],
				faction,
				enabled: true
			}, `players.${message.author.id}`)
			message.reply(`suc your game.`)
		}
	}
	const editValue = (id, o, n) => {
		o.value = n
		client.cards.set(id, o)
		message.reply('successfully set the new value.')
	}
	const editOwner = async (id, o, n) => {
		let user = await client.fetchUser(n, message)
		if (!user) return message.reply('you must provide a valid user.')
		o.owner = user.id
		client.cards.set(id, o)
		message.reply('successfully set the new value.')
	}
	const editColour = (id, o, n) => {
		if (!['black', 'white'].includes(n.toLowerCase())) return message.reply('Please choose a valid colour.')
		o.type = n
		client.cards.set(id, o)
		message.reply('successfully set the new value.')
	}

	if (!args[0]) return message.reply('please provide a action.')
	let action = funcs[args.shift()]
	if (!action) return message.reply('invalid action.')
	action(...args)

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['cah'],
	permLevel: "User",
	hidden: true
};

exports.help = {
	name: "iaj",
	category: "Islands Against Jwiggs",
	description: "Admin commands for the Islands Against Jwiggs Game.",
	usage: `iaj [search/info/edit/delete]
search:: iaj search [query]
info:: iaj info [id]
edit:: iaj edit [id] [value/owner/colour] [new value]
delete:: iaj delete [id]`
};
