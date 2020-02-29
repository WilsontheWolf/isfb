const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  if (!message.attachments.first() && !args[0]) {
    return message.channel.send(
      "Please attach the savefile to your command message"
    );
  } else {
    message.react("524998745725861904");
    let url;
    if (message.attachments.first()) url = message.attachments.first().url;
    else url = args[0];
    let objects = await client.smartRead(url, message);
    let comment;
    if (objects[2]) comment = objects[1].comment;
    if (!objects[0]) return message.channel.send("Nothing found on that slot!");
    let save = objects[0];
    if (!save.exists) return message.channel.send("Error reading save file!");
    let version = parseFloat(save.exists.version);
    let resources = save.resources.resources.split(" ");
    let realm;
    if (version <= 5) realm = parseInt(save.map.map.split(" ")[0]) + 1;
    else realm = "N/A";
    let seed;
    if (version > 5 && version <= 6.1) seed = parseInt(save.realm.seed);
    else seed = "N/A";
    if (version >= 6.2) {
      let iisland = save.player.data.split(' ')
      let i
      let max = 8
      if (version >= 6.4) max = 9
      for (i = 0; i < max; i++) {
        iisland.shift()
      }
      save.island = {}
      save.island.island = iisland.join(' ')
    }
    let island = client.parse_island(save);
    let inventorySize = parseFloat(save.inventory.size);
    const embed = new Discord.RichEmbed().setTitle(`Save File for V${version}`);
    if (comment) embed.addField("Comment", comment);
    embed
      .addField(
        `Resources:`,
        `<:money:584798093736804365>${resources[0]} 
<:core:584797949444358146>${resources[2]}/${resources[1]}`
      )
      .addField(
        `Realm:`,
        `${realm}
seed: ${seed}`
      )
      .addField(`Inventory:`, `Size: ${inventorySize}`)
      .addField(
        `IIsland:`,
        `Width: ${parseFloat(island.islandWidth) + 1}
Height: ${parseFloat(island.islandHeight) + 1}`
      );
    if (objects[2])
      embed
        .addField(
          `Public:`,
          `${await client.saves.get(
            message.author.id,
            `saves.${objects[2]}.public`
          )}`
        )
        .setColor("RANDOM")
        .addField("Image:", "<a:e:524998745725861904> Processing...");
    let msg = await message.channel.send(embed);
    let image;
    if (objects[1]) {
      embed.fields.pop();
      embed.setImage(objects[1].image);
      msg.edit(embed);
    } else {
      image = await client.generateIsland(save);
      let imageMsg = await client.channels
        .get("585121990541574155")
        .send(`Image generated for: \`${message.author.tag}\``, image);
      embed.fields.pop();
      embed.setImage(imageMsg.attachments.first().url);
      msg.edit(embed);
    }
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["inspect"],
  permLevel: "User",
  hidden: false
};
exports.help = {
  name: "stats",
  category: "Saves",
  description: "Get save stats",
  usage: "ping"
};
