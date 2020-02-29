const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  const options = [`money`, `realm`, `lives`, `seed`, `blocks`];
  let final;
  if (!message.attachments.first() && !args[2])
    return message.channel.send(
      "Please attach the savefile to your command message or your slot number after your modifcations\nE.G. `-modify money 123 2` to set your money to 123 on slot 2.\nFor more examples use `-help modify`"
    );
  if (!args[0])
    return message.channel.send(`Please choose how you want to modify your file.
your chooses are:
\`${options.join("\n")}\``);
  if (!options.includes(args[0]))
    return message.channel
      .send(`Please choose a valid way you want to modify your file.
your chooses are:
\`${options.join("\n")}\``);
  message.react("524998745725861904");
  let url;
  let fileName;
  if (message.attachments.first()) {
    url = message.attachments.first().url;
    fileName = message.attachments.first().filename;
  } else {
    if (args[0] == "blocks") url = args[3];
    else url = args[2];
    let urlsplit;
    if (url) urlsplit = url.split("/");
    else urlsplit = [url];
    fileName = urlsplit[urlsplit.length - 1];
  }
  if (!url) return message.channel.send("No save attached!");
  let objects = await client.smartRead(url, message);
  if (!objects[0]) return message.channel.send("Nothing found on that slot!");
  let save = objects[0];
  if (!save.exists) return message.channel.send("Error reading save file!");
  let resources = save.resources.resources.split(" ");
  let map;
  let version = parseFloat(save.exists.version);
  if (version > 5) map = save.realm;
  else map = save.map.map.split(" ");
  if (!save.exists) return message.channel.send("Error reading save file!");
  if (args[0] == "money") {
    if (!args[1])
      return message.channel.send(
        `Please have what you want to change the value to.`
      );
    if (!parseFloat(args[1]))
      return message.channel.send(`Please Choose a valid number.`);
    resources[0] = parseFloat(args[1]);
    save.resources.resources = resources.join(" ");
    final = client.saveFile(save);
    if (objects[2]) {
      await client.writeFileSlot(save, objects[2], message);
      await message.channel.send(
        `Modified file on slot ${objects[2]} succsesfully!`
      );
    } else await client.sendFile(save, message, fileName);
  }
  if (args[0] == "realm") {
    if (version > 5) return message.channel.send(`Error incompatible version!`);
    if (!args[1])
      return message.channel.send(
        `Please have what you want to change the value to.`
      );
    if (!parseFloat(args[1]))
      return message.channel.send(`Please Choose a valid number.`);
    map[0] = parseFloat(args[1]) - 1;
    save.map.map = map.join(" ");
    final = client.saveFile(save);
    if (objects[2]) {
      await client.writeFileSlot(save, objects[2], message);
      await message.channel.send(
        `Modified file on slot ${objects[2]} succsesfully!`
      );
    } else await client.sendFile(save, message, fileName);
  }
  if (args[0] == "lives") {
    if (!args[1])
      return message.channel.send(
        `Please have what you want to change the value to.`
      );
    if (!parseFloat(args[1]))
      return message.channel.send(`Please Choose a valid number.`);
    resources[2] = parseFloat(args[1]);
    save.resources.resources = resources.join(" ");
    final = client.saveFile(save);
    if (objects[2]) {
      await client.writeFileSlot(save, objects[2], message);
      await message.channel.send(
        `Modified file on slot ${objects[2]} succsesfully!`
      );
    } else await client.sendFile(save, message, fileName);
  }
  if (args[0] == "seed") {
    if (version <= 5)
      return message.channel.send(`Error incompatible version!`);
    if (!args[1])
      return message.channel.send(
        `Please have what you want to change the value to.`
      );
    if (!parseFloat(args[1]))
      return message.channel.send(`Please Choose a valid number.`);
    map.seed = `${parseFloat(args[1])}`;
    final = client.saveFile(save);
    if (objects[2]) {
      await client.writeFileSlot(save, objects[2], message);
      await message.channel.send(
        `Modified file on slot ${objects[2]} succsesfully!`
      );
    } else await client.sendFile(save, message, fileName);
  }
  if (args[0] == "blocks") {
    if (version >= 5) message.channel.send(`Warning may cause issues.`);
    else
      message.channel.send(
        `Warning untested save. May cause more issues or not work.`
      );
    if (!args[1])
      return message.channel.send(
        `Please have what you block you want to change.`
      );
    if (!args[2])
      return message.channel.send(
        `Please have what you want to change the block to.`
      );
    let replace = true;
    let island = await client.parse_island(save);

    while (replace) {
      island.block.forEach(row => {
        if (row[0])
          row.forEach(b => {
            if (!b) return;
            let split = b.split("|");
            if (split[0] == args[1]) split[0] = args[2];
            b = split.join("|");
          });
      });
      // if(save.island.island.search(` ${args[1].toLowerCase()}|`) != -1){save.island.island= save.island.island.replace(` ${args[1].toLowerCase()}|`, ` ${args[2].toLowerCase()}|`)}
      replace = false;
    }

    final = client.saveFile(save);
    if (objects[2]) {
      await client.writeFileSlot(save, objects[2], message);
      await client.writeIslandImageSlot(save, objects[2], message);
      await message.channel.send(
        `Modified file on slot ${objects[2]} succsesfully!`
      );
    } else await client.sendFile(save, message, fileName);
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["edit", "cheat", "hack", "hax"],
  permLevel: "User",
  hidden: false
};
exports.help = {
  name: "modify",
  category: "Saves",
  description: "Modifies IIoW savefile",
  usage: `modify (what) (to what) (optional: save slot)
modify money amount 
modify realm amount
modify lives amount
modify seed amount
modify blocks (name of before) (name after)`
};
