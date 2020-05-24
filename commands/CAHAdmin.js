const funcs = {}
  
exports.run = async (client, message, args, level) => {
  if(!args[0]) return message.reply('please provide a action.')
  let action = funcs(args.shift())
  if(!action) return message.reply('invalid action.')
  action(...args)
  funcs.delete = (id) => {
    if(id == 'count') return message.reply('invalid id.')
    let c = client.cards.get(id)
    if(!c)
    client.cards.delete(id)
    message.reply(`Deleted card \`${id}\` with value \`${c.value}\``)
  }
  funcs.edit = (id, type, value) => {
    
  }
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
