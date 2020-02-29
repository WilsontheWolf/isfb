const Discord = require("discord.js");
const snek = require("snekfetch");

exports.run = async (client, message, args, level) => {
  if (!message.attachments.first() && !args[0]) {
    return message.channel.send(
      "Please attach the savefile to your command message"
    );
  }
  let url;
  if (message.attachments.first()) {
    url = message.attachments.first().url;
  } else {
    url = args[0];
  }
  let msg = await message.channel.send(
    `<a:e:524998745725861904> Processing...`
  );
  let save = await client.readInternetFile(url);
  if (!save.exists) return msg.edit("Error! While reading savefile.");
  let image = await client.generateIsland(save);
  msg.delete();
  message.reply(
    "Notice this command is decapricated! Use `-stats` for a image plus more!",
    image
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["show", "peek", "iisland"],
  permLevel: "User",
  hidden: true
};

exports.help = {
  name: "island",
  category: "Saves",
  description:
    "**Decapirated use stats** Shows picture of island on a savefile",
  usage: "island"
};
