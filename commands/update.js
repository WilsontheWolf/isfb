const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply(`please choose a save file to update.`);
  let slot = parseInt(args[0]);
  if (!slot)
    return message.reply(`please choose a save file number to update.`);
  if (slot > 5 || slot < 1)
    return message.reply(
      `please choose a save file slot less from 1-5 to update.`
    );
  let file = await client.saves.get(message.author.id, `saves.${slot}`);
  let save = file.save;
  let fileName = file.fileName;
  if (!save)
    return message.channel.send(
      `Error! No savefile on slot ${slot}. To save one here do \`-save ${slot}\` and attach your save.`
    );
  if (!save.exists)
    return message.channel.send(`Error! Corrupt savefile on slot ${slot}.`);
  if (file.public == undefined) await client.fixSave(slot, message.author.id);
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
      public: file.public,
      format: 2,
      comment: ""
    },
    `saves.${slot}`
  );
  message.channel.send(
    `Updated info for save file \`${fileName}\` on slot ${slot}`
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["refresh"],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "update",
  category: "Saves",
  description: "Update a saved savefile",
  usage: "**ATTACH SAVEFILE** update #"
};
