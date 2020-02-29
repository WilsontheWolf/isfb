const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply(`please choose a save file to save to.`);
  let slot = parseInt(args[0]);
  if (!slot)
    return message.reply(`please choose a save file number to save to.`);
  if (slot > 5 || slot < 1)
    return message.reply(
      `please choose a save file slot less from 1-5 to save to.`
    );
  if (!message.attachments.first() && !args[1])
    return message.channel.send(
      "Please attach the savefile to your command message"
    );
  message.react("524998745725861904");
  let url;
  let fileName;
  if (message.attachments.first()) {
    url = message.attachments.first().url;
    fileName = message.attachments.first().filename;
  } else {
    url = args[1];
    let urlsplit = url.split("/");
    fileName = urlsplit[urlsplit.length - 1];
  }
  let old = await client.saves.get(message.author.id, `saves.${slot}.save`);
  let responce;
  if (old)
    responce = await client.awaitReply(
      message,
      `There is already a save located on slot ${slot}. Overwrite?`
    );
  if (responce) responce = responce.toLowerCase();
  if (responce)
    if (!responce.startsWith("y"))
      return message.channel.send(`Writing canceled.`);
  if (old) if (!responce) return message.channel.send("no responce. canceled");
  let save = await client.readInternetFile(url);
  if (!save.exists)
    return message.channel.send("Error! While reading savefile.");
  if (save.exists.version >= 6.2) {
    let iisland = save.player.data.split(' ')
    let i
    for (i = 0; i <8; i++) {
      iisland.shift()
    }
    save.island = {}
    save.island.island = iisland.join(' ')
  }
  let image = await client.generateIsland(save);
  let imageMsg = await client.channels
    .get("585121990541574155")
    .send(`Image for \`${message.author.tag}\` save slot ${slot}.`, image);
  client.saves.set(
    message.author.id,
    {
      save: save,
      fileName: `${fileName}`,
      image: imageMsg.attachments.first().url,
      version: parseFloat(save.exists.version),
      public: false,
      format: 2,
      comment: ""
    },
    `saves.${slot}`
  );
  message.channel.send(`Saved save file \`${fileName}\` to slot ${slot}`);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: false
};
exports.help = {
  name: "save",
  category: "Saves",
  description: "Saves a copy of your savefile",
  usage: "**ATTACH SAVEFILE** save #"
};
