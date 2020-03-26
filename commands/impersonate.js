exports.run = async (client, message, args, level) => {
  let user = message.guild.members.get('517371142508380170')
  
  let hooks = await message.channel.fetchWebhooks();
  let hook;
  if (hooks.size == 0)
    hook = await message.channel.createWebhook("IIOW SFE Move Webhook", client.user.avatarURL);
  else hook = hooks.first();
    

    hook.send('Now to make a command', 
          {username: user.displayName, 
           avatarURL: user.user.displayAvatarURL })
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sayas'],
  permLevel: "Administrator",
  hidden: true
};
exports.help = {
  name: "impersonate",
  category: "Miscelaneous",
  description: "Become someone else.",
  usage: "impersonate [user] [message]"
};
