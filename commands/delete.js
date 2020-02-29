const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply(`Please choose a savefile to delete.`);
  let slot = parseInt(args[0]);
  if (!slot) return message.reply(`Please choose a savefile number to delete.`);
  if (slot > 5 || slot < 1)
    return message.reply(
      `Please choose a savefile slot less from 1-5 to delete.`
    );
  message.react("524998745725861904");

  let old = await client.saves.get(message.author.id, `saves.${slot}.save`);
  let responce;
  if (!old) return message.channel.send("Deleted air");
  responce = await client.awaitReply(
    message,
    `Are you sure you want to delete slot ${slot}?`
  );
  responce = responce.toLowerCase();
  if (responce)
    if (!responce.startsWith("y"))
      return message.channel.send(`Deletion canceled.`);
  if (!responce) return message.channel.send("no responce. canceled");
  client.saves.set(message.author.id, {}, `saves.${slot}`);
  message.channel.send(`Deleted savefile slot ${slot} D:`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "delete",
  category: "Saves",
  description: "Deletes saved savefile",
  usage: "delete #"
};
