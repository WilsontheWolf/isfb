const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  try {
    if (!args[0])
      return message.reply("Please choose a number of messages to purge");
    let amount = Math.floor(args[0]);
    if (!amount)
      return message.reply("Please choose a number of messages to purge");
    if (
      !message.guild.me
      .hasPermission("MANAGE_MESSAGES", false, true, true)
    )
      return message.channel.send(
        "I need to be able to properly purge messages here."
      );
    let dmessages;
    let msg
    try{msg = await message.channel.fetchMessage(args[0])} catch(e){}
    console.log(amount,!!msg,!msg && amount > 100 || amount < 1)
    if (!msg && amount > 100 || amount < 1)
      return message.channel.send("Enter a number between 1 - 100");
    if(!msg) await message.delete();
    let msgs
    if(!msg)
      msgs = await message.channel.fetchMessages({ limit: amount });
    else {
      msgs = await message.channel.fetchMessages({after: args[0], limit:100})
      while(!msgs.has(message.channel.lastMessageID)){
        let m = await message.channel.fetchMessages({after: msgs.first().id, limit:100})
        msgs = m.concat(msgs)
      }
    }
    if(msg) {
      await message.delete();
      msgs.delete(message.channel.lastMessageID)
    }
    let embed = Discord.RichEmbed;
    message.channel.bulkDelete(msgs);
    let sentMessage = await message.channel.send(
      ` \`${msgs.size}\` messages deleted.`
    );
    sentMessage.delete(3000);
  } catch(e) {
    message.reply('Sorry something went wrong!```'+e+'```')
  }
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator",
  hidden: true
};
exports.help = {
  name: "purge",
  category: "Miscelaneous",
  description: "Move messages from one channel to another .",
  usage: "purge <1-100>"
};
