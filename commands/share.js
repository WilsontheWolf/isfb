const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply(`please choose a save file to share.`);
  let slot = parseInt(args[0]);
  if (!slot) return message.reply(`please choose a save file number to share.`);
  if (slot > 5 || slot < 1)
    return message.reply(
      `please choose a save file slot less from 1-5 to share.`
    );
  message.react("524998745725861904");
  let file = await client.saves.get(message.author.id, `saves.${slot}`);
  let save = file.save;
  let fileName = file.fileName;
  if (!save)
    return message.channel.send(
      `Error! No savefile on slot ${slot}. To save one here do \`-save ${slot}\` and attach your save.`
    );
  if (!save.exists)
    return message.channel.send(`Error! Corrupt savefile on slot ${slot}.`);
  if (!file.public) {
    client.saves.set(message.author.id, true, `saves.${slot}.public`);
    message.channel.send(`Save file \`${fileName}\` is now public.`);
  } else {
    client.saves.set(message.author.id, false, `saves.${slot}.public`);
    message.channel.send(`Save file \`${fileName}\` is no longer public.`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "share",
  category: "Saves",
  description: "Make a saved savefile public",
  usage: "share #"
};
