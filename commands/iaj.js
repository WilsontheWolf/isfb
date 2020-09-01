const funcs = {}
const Discord = require('discord.js')
const { Client, Message } = require("discord.js");
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
	let games = client.games
	const count = (str) => {
		const re = /\({0,1}_+\){0,1}/g
		return ((str || '').match(re) || []).length
	}
	const genCode = async (length = 5) => {
		let valid = false
		let characters = 'abcdefghijklmnopqrstuvwxyz';
		let result = ''
		while (!valid) {
			for (let i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * characters.length));
			}
			if (!(await games.has(result))) valid = true
		}
		return result
	}

	funcs.delete = async function deletion(id) {
		let c = await client.cards.get(id)
		if (!c) return message.reply('invalid id.')
		if (level < 5 && message.author.id != c.owner) return message.reply("you don't have the perms to use this sub-command.")
		await client.cards.delete(id)
		message.reply(`Deleted card \`${id}\` with value \`${c.value}\``)
	}
	funcs.edit = async function edit(id, type) {
		if (level < 5) return message.reply("you don't have the perms to use this sub-command.")
		type = type.toLowerCase()
		let a = Object.values(arguments)
		a.splice(0, 2)
		let value = a.join(' ')
		let c = await client.cards.get(id)
		if (!c) return message.reply('invalid id.')
		if (!['value', 'owner', 'colour'].includes(type)) return message.reply('invalid type.')
		if (type == 'value') editValue(id, c, value)
		if (type == 'owner') editOwner(id, c, value)
		if (type == 'colour') editColour(id, c, value)
	}
	funcs.search = async function search() {
		let q = Object.values(arguments)
		let cds = await client.cards.filter(v => v.toLowerCase().includes(q.join(' ').toLowerCase()), 'value');
		if (!cds.length) return message.reply('no results found.')
		let r = cds.map((v) => `${v[0]} ${client.users.cache.has(v[1].owner) ? client.users.cache.get(v[1].owner).tag : "Unknown User (" + v[1].owner + ")"} ${v[1].type}: ${v[1].value}`).join('\n')
		const embed = new Discord.MessageEmbed()
			.setTitle('Results')
			.setDescription(`\`\`\`${r.substr(0, 2041)}${r.length > 2041 ? '…' : ''}\`\`\``)
		message.channel.send(embed)
	}
	funcs.info = async function info(id) {
		let c = await client.cards.get(id)
		if (!c) return message.reply('no such card.')
		const embed = new Discord.MessageEmbed()
			.setAuthor(`Info for card ${id}`)
			.setTitle('Content:')
			.setDescription(c.value)
			.addField('Owner:', client.users.cache.has(c.owner) ? client.users.cache.get(c.owner).tag : "Unknown User (" + c.owner + ")", true)
			.addField('Type:', c.type, true)

		message.channel.send(embed)
	}
	funcs.create = async function create() {
		if (level < 9) return message.reply("you don't have the perms to use this sub-command.")
		let size = await games.size
		if (size >= 1) return message.reply('Sorry the maximum amount of games has been reached!')
		let white = await client.cards.filter(c => c.type == 'white' && !c.value.includes('http'))
		let black = await client.cards.filter(c => c.type == 'black' && count(c.value) < 3)
		let id = await genCode()
		await games.set(id, {
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
	funcs.start = async function start(id) {
		let game = await games.get(id)
		if (!game) return message.reply('No such game!')
		if (level < 9 && game.owner != message.author.id) return message.reply(`You don't have the permissions to start this game.`)
		if (Object.keys(game.players).size < 3) return message.reply("You don't have enough players to continue.")
		client.emit('cahStart', id)
		message.reply(`I've started your game.`)
	}
	funcs.join = async function join(id) {
		if (await games.find(g => g.players[msg.author.id])) return message.reply('You are already in a game.')
		let game = await games.get(id)
		if (!game) return message.reply('No such game!')
		if (game.players[message.author.id] && game.players[message.author.id]) return message.reply("You're already in this game.")
		if (game.players[message.author.id] && !game.players[message.author.id]) {
			await games.set(`${id}.players.${message.author.id}.enabled`, true)
			message.reply('You have re-joined the game. You can participate next round.')
			await games.set(`${id}.players.${message.author.id}.selected`, 'idk')
		} else {
			let faction = client.getFaction(message.member || message.author)
			if (!client.getFaction(message.member || message.author)) return message.reply("You must be in a faction to join.")
			await games.set(`id.players.${message.author.id}`, {
				id: message.author.id,
				points: 0,
				selected: [],
				cards: [],
				faction,
				enabled: true
			})
			message.reply(`suc your game.`)
		}
	}
	const editValue = async (id, o, n) => {
		o.value = n
		await client.cards.set(id, o)
		message.reply('successfully set the new value.')
	}
	const editOwner = async (id, o, n) => {
		let user = await client.fetchUser(n, message)
		if (!user) return message.reply('you must provide a valid user.')
		o.owner = user.id
		await client.cards.set(id, o)
		message.reply('successfully set the new value.')
	}
	const editColour = async (id, o, n) => {
		if (!['black', 'white'].includes(n.toLowerCase())) return message.reply('Please choose a valid colour.')
		o.type = n
		await client.cards.set(id, o)
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
