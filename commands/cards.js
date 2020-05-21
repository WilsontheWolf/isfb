const Discord = require('discord.js')
const count = (str) => {
  const re =  /\({0,1}_+\){0,1}/g
  return ((str || '').match(re) || []).length
}
exports.run = async (client, message, args, level) => {
  let user = message.author
  if(args[0]) user = await client.fetchUser(args.join(' '), message)
  let black = client.cards.filter(c => c.type == 'black')
let white = client.cards.filter(c => c.type == 'white')
let combos = 0
black.forEach(c => {
combos += count(c.value) || 1
})
  combos = combos * white.size
const embed = new Discord.RichEmbed()
.setTitle('Card Stats')
.addField('Total Cards:', client.cards.count - 1, true)
.addField('Black Cards:', black.size, true)
.addField('White Cards:', white.size, true)
.addField('Unique Combos:', combos, true)
.addField(`${user == message.author ? 'Your' : user.username + "'s"} Cards:`, client.cards.filter(c => c.owner == user.id).size, true)
message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "cards",
  category: "Islands Against Jwiggs",
  description: "See how many cards there are for the server's IIslands Against Jwiggs competiton.",
  usage: "ping"
};
