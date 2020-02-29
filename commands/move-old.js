exports.run = async (client, message, args, level) => {
  if(message.guild.id !== '519997113648676879')
  if(!args[0]) return message.reply('Please choose a number of messages to move') 
  let amount = Math.floor(args[0])
  if(!amount) return message.reply('Please choose a number of messages to move') 
  if (!message.guild.members.get(client.user.id).hasPermission('MANAGE_MESSAGES',  false, true, true))return message.channel.send('I need to be able to properly move messages here.');
  let dmessages
  if (amount > 100 || amount <2) return message.channel.send('Enter a number between 2 - 100')
  let channel = message.mentions.channels.first()
  if(!channel) return message.channel.send('Please mention a channel.')
  await message.delete()
  let msgs = await message.channel.fetchMessages({limit: amount})
  let hooks = await channel.fetchWebhooks()
  let hook
  let originals = ["IIOW SFE Move Webhook", client.user.avatarURL]
  if(hooks.size == 0) hook = await channel.createWebhook(originals[0], originals[1])
  else {
    hook = hooks.first()
    originals = [hook.name, hook.avatar]
  }
  let last = null
  let errors = 0
  msgs.forEach(async msg => {// make this a for loop
    try{
      if(last)if(last[0] == msg.member.displayName && last[1] == msg.author.avatarURL) return await hook.send(msg.cleanContent)
      last = [msg.member.displayName, msg.author.avatarURL]
      await hook.edit(last[0], last[1])
      await hook.send(msg.cleanContent)
    } catch (e) {
      console.error(e)
      errors =+ 1
    }
  });
  let sentMessage = await message.channel.send(` \`${msgs.size}\` messages moved (?)`)
  hook.edit(originals[0],originals[1])
  await client.wait(3000)
  sentMessage.delete()
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'Moderator',
  hidden: true
};
exports.help = {
  name: "move-test",
  category: "Miscelaneous",
  description: "Move messages to another channel.",
  usage: "move <1-100> #newchannel"
};
