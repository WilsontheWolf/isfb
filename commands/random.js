const Discord = require('discord.js')
exports.run = async (client, message, args, level) => {
  const count = (str) => {
    const re =  /\({0,1}_+\){0,1}/g
    return ((str || '').match(re) || []).length
  }
  let regex = /\({0,1}_+\){0,1}/
  let black
  if(!args[0]) black = client.cards.filter(c => c.type == 'black').random() 
  else black = {
    type: 'black',
    owner: message.author.id,
    value: args.join(' ')
  }
  let whites = count(black.value)
  let white = []
  for(let i = 0; i < whites;i++){
    let w = client.cards.filter(c => c.type == 'white').random()
    if(message.flags[i]) w = {
      type: 'white',
    owner: message.author.id,
    value: message.flags[i].replace(/_/g, ' ')
    }
    w.name = `Unknown User (${w.owner})`
    if(client.users.has(w.owner)) w.name = client.users.get(w.owner).username
    white.push(w)
    black.value = black.value.replace(regex, w.value)
  }
  if(!whites) {
    let w = client.cards.filter(c => c.type == 'white').random()
    w.name = `Unknown User (${w.owner})`
    if(client.users.has(w.owner)) w.name = client.users.get(w.owner).username
    white.push(w)
    black.value += ' ' + w.value
  }
  let bName = `Unknown User (${black.owner})`
  if(client.users.has(black.owner)) bName = client.users.get(black.owner).username
  const embed = new Discord.RichEmbed()
  .setTitle('Random IIslands Against Jwiggs Combo')
  .setDescription(black.value)
  .addField(`Black Card Submitted By:`, bName, true)
  .addField(`White Card${white.length == 1 ? '' : 's'} Submitted By:`, white.map(w => w.name).filter((v,i,a) => a.indexOf(v) === i).join(', '), true)
  .setColor('RANDOM')
  message.channel.send(embed)
  }

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['rand', 'randomcard', 'iajrandom'],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "random",
  category: "Islands Against Jwiggs",
  description: "Get a random pair of black and white IIslands Against Jwiggs Cards:tm:.",
  usage: "random"
};
