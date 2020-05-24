exports.run = async (client, message, args, level) => {
  if(!args[0]) return message.channel.send('please provide a action.')
  let action = args[0]
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
