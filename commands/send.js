const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply(`please choose a save file to share.`);
  let slot = parseInt(args[0]);
  args.shift();
  let person = args.join(" ");
  if (!slot) return message.reply(`please choose a save file number to share.`);
  if (slot > 5 || slot < 1)
    return message.reply(
      `please choose a save file slot less from 1-5 to share.`
    );
  if (!person) return message.reply(`please say who you want to send it to.`);
  let file = await client.saves.get(message.author.id, `saves.${slot}`);
  message.react("524998745725861904");
  let save = file.save;
  let fileName = file.fileName;
  if (!save)
    return message.channel.send(
      `Error! No savefile on slot ${slot}. To save one here do \`-save ${slot}\` and attach your save.`
    );
  if (!save.exists)
    return message.channel.send(`Error! Corrupt savefile on slot ${slot}.`);
  if (file.public == undefined) await client.fixSave(slot, message.author.id);
  let user = await client.fetchUser(person, message);
  if (!user) return message.channel.send(`Error! No user.`);
  if (user.id == message.author.id)
    return message.channel.send(
      `You can't send your self a save. If you want your save use \`-download ${slot}\``
    );
  const embed = new Discord.RichEmbed()
    .setTitle(`Confirm send.`)
    .setDescription(
      `Are you sure you want to send the file on ${slot} to ${user.tag}?`
    );
  let responce = await client.awaitReply(message, embed);
  responce = responce.toLowerCase();
  if (responce)
    if (!responce.startsWith("y"))
      return message.channel.send(`Sending canceled.`);
  if (!responce) return message.channel.send("no responce. canceled");
  else {
    let msg = await message.channel.send("<a:e:524998745725861904> Sending...");
    let object = await client.saveFile(save);
    let file = new Discord.Attachment(await client.writeFile(object), fileName);
    try {
      await user.send(`${message.author.tag} sent you a save file.`, file);
      msg.edit(`Sent to ${user.tag}`);
    } catch (e) {
      msg.edit(`Error sending file to ${user.tag}
\`\`\`
${e}
\`\`\`
`);
    }
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
  name: "send",
  category: "Saves",
  description: "Send a saved savefile to a user",
  usage: "send # person"
};
