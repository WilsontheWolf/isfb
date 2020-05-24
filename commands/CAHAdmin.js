const funcs = {}
  const Discord = require('discord.js')
exports.run = async (client, message, args, level) => {
  funcs.delete = function deleteis(id){
    if(id == 'count') return message.reply('invalid id.')
    let c = client.cards.get(id)
    if(!c) return message.reply('invalid id.')
    client.cards.delete(id)
    message.reply(`Deleted card \`${id}\` with value \`${c.value}\``)
  }
  funcs.edit = function edit(id, type) {
    type = type.toLowerCase()
    let a = Object.values(arguments)
    a.splice(0, 2)
    let value = a.join(' ')
    if(id == 'count') return message.reply('invalid id.')
    let c = client.cards.get(id)
    if(!c) return message.reply('invalid id.')
    if(!['value', 'owner', 'colour'].includes(type)) return message.reply('invalid type.')
    if(type == 'value') editValue(id, c, value)
    if(type == 'owner') editOwner(id, c, value)
    if(type == 'colour') editColour(id, c, value)
  }
  funcs.search = function search(){
    let q = Object.values(arguments)
    let cds = client.cards.filter(c => c.value && c.value.toLowerCase().includes(q.join(' ').toLowerCase()))
    if (!cds.size) return message.reply('no results found.')
    let r = cds.map((c, i) => `${i} ${client.users.has(c.owner) ? client.users.get(c.owner).tag : "Unknown User (" + c.owner + ")"} ${c.type}: ${c.value}`).join('\n')
    const embed = new Discord.RichEmbed()
    .setTitle('Results')
    .setDescription(`\`\`\`${r.substr(0, 2041)}${r.length > 2041 ? '…' : ''}\`\`\``)
    message.channel.send(embed)
    }
  funcs.info = function search(id){
    if(id == 'count') return message.reply('invalid id.')
    let c = client.cards.get(id)
    if (!c) return message.reply('no such card.')
    const embed = new Discord.RichEmbed()
    .setTitle(`Card ${id}`)
    .setDescription(c.value)
    .addField('Owner:', client.users.has(c.owner) ? client.users.get(c.owner).tag : "Unknown User (" + c.owner + ")", true)
    .addField('Type:', c.type, true)
    
    message.channel.send(embed)
  }
  const editValue = (id, o, n) => {
    o.value = n
    client.cards.set(id, o)
    message.reply('successfully set the new value.')
  }
  const editOwner = async (id, o, n) => {
    let user = await client.fetchUser(n, message)
    if(!user) return message.reply('you must provide a valid user.')
    o.owner = user.id
    client.cards.set(id, o)
    message.reply('successfully set the new value.')
  }
  const editColour = (id, o, n) => {
    if(!['black', 'white'].includes(n.toLowerCase())) return message.reply('Please choose a valid colour.')
    o.type = n
    client.cards.set(id, o)
    message.reply('successfully set the new value.')
  }
  
  if(!args[0]) return message.reply('please provide a action.')
  let action = funcs[args.shift()]
  if(!action) return message.reply('invalid action.')
  action(...args)
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['cah'],
  permLevel: "Bot Admin",
  hidden: true
};

exports.help = {
  name: "iaj",
  category: "Islands Against Jwiggs",
  description: "Admin commands for the Islands Agains Jwiggs Game.",
  usage: ""
};
