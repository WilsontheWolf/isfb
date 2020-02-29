const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  let user;

  if (!args[0]) return message.reply(`please choose a save file to download.`);
  let slot = parseInt(args[0]);
  if (!slot)
    return message.reply(`please choose a save file number to download.`);
  if (slot > 5 || slot < 1)
    return message.reply(
      `please choose a save file slot less from 1-5 to download.`
    );
  args.shift();
  user = args.join(" ");
  message.react("524998745725861904");
  if (args[0]) user = await client.fetchUser(args.join(" "), message);
  if (!user) user = message.author;
  try {
    let file = await client.saves.get(user.id, `saves.${slot}`);
    let save = file.save;
    let fileName = file.fileName;
    if (!save)
      if (message.author.id == user.id)
        return message.channel.send(
          `Error! No savefile on slot ${slot}. To save one here do \`-save ${slot}\` and attach your save.`
        );
    if (!save)
      return message.channel.send(
        `Error! ${user.tag} has no savefile on slot ${slot}.`
      );
    if (!save.exists)
      return message.channel.send(`Error! Corrupt savefile on slot ${slot}.`);
    if (!file.public && user.id != message.author.id)
      return message.channel.send("Error file not public.");

    client.sendFile(save, message, fileName);
  } catch (e) {
    message.channel.send(`Error downloading same from \`${user.tag}\`
\`\`\`
${e}
\`\`\``);
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
  name: "download",
  category: "Saves",
  description: "Download a saved savefile",
  usage: "**ATTACH SAVEFILE** download #"
};
