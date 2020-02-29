const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  if (!args[0])
    return message.reply(`please choose a save file to comment on.`);
  let slot = parseInt(args.shift());
  if (!slot)
    return message.reply(`please choose a save file number to comment on.`);
  if (slot > 5 || slot < 1)
    return message.reply(
      `please choose a save file slot less from 1-5 to comment on.`
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
  client.saves.set(
    message.author.id,
    args.join(" ").substr(0, 100),
    `saves.${slot}.comment`
  );
  message.channel.send(`Save file \`${fileName}\` now has comment:
${args.join(" ").substr(0, 100)}`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["note"],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "comment",
  category: "Saves",
  description: "Add a comment to a saved savefile",
  usage: "comment # comment"
};
