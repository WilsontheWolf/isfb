const { Client, Message } = require("discord.js");
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
  let subbed = await client.crystals.has(message.author.id)
  if(subbed) {
    await client.crystals.delete(message.author.id)
    message.reply("I've unsubscribed you from crystal cooldown notifications.")
  } else {
    await client.crystals.set(message.author.id, true)
    message.reply("I've subscribed you to crystal cooldown notifications.")
  } 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: true
};

exports.help = {
  name: "cooldown",
  category: "Miscelaneous",
  description: "(Un)subscribe to cooldown notifications.",
  usage: "cooldown"
};
