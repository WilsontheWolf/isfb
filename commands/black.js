const submit = (s) =>{
  
}

exports.run = async (client, message, args, level) => {
  if(!args[0]) return message.reply('please put your submission')
  let submissions = args.join(' ').split('\n')
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: true
};

exports.help = {
  name: "black",
  category: "IIslands Against Jwiggs",
  description: "Submit a black card. Several can be submitted by seperating them with a new line.",
  usage: "black [submissons]"
};
