const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {
  let user 
  if(args[0]) user = await client.fetchUser(args.join(' '), message)
  if (!user) user = message.author
  const embed = new Discord.RichEmbed()
  .setTitle(`Saves for ${user.tag}`)
 if (message.author.id == user.id) embed.setFooter(`For more info use \`-stats [file#]\`. To save a file use \`-save [file#]\` and attach your file. To reload the info in your save \`-update [file#]\``)
  else embed.setFooter(`For more info use \`-stats [file#]\`. WIP`)
  try{let files = await client.saves.get(user.id, `saves`)
  let i
  for (i=1;i<6;i++){
    let file = files[i]
    if (!file.version) {
      embed.addField(`File ${i}`,`Blank`)
    }
    else{
      if (file.public == undefined) await client.fixSave(i, user.id) 
      let resources = file.save.resources.resources.split(' ')
      if (!file.public && user.id != message.author.id)embed.addField(`File ${i}`,`Not public`)
      else embed.addField(`File ${i}`,
                     `Name: ${file.fileName}
Public: ${file.public}
Version: ${file.version}
Resources:<:money:584798093736804365>${resources[0]}<:core:584797949444358146>${resources[2]}/${resources[1]}
${file.comment}`)
    }
  }
  message.channel.send(embed)}
  catch (e) {message.channel.send(`Error fetching info for \`${user.tag}\`
\`\`\`
${e}
\`\`\``)}
  };

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['files'],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "saves",
  category: "Saves",
  description: "Shows your saved savefiles",
  usage: "**ATTACH SAVEFILE** saves"
};