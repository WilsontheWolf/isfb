const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  try {
    if (!args[0])
      return message.reply("Please choose a number of messages to move");
    let amount = Math.floor(args[0]);
    if (!amount)
      return message.reply("Please choose a number of messages to move");
    if (
      !message.guild.members
      .get(client.user.id)
      .hasPermission("MANAGE_MESSAGES", false, true, true)
    )
      return message.channel.send(
        "I need to be able to properly move messages here."
      );
    let dmessages;
    let msg
    msg = await message.channel.fetchMessage(args[0]).catch()
    console.log(msg)
    if (amount > 100 || amount < 1 && !msg)
      return message.channel.send("Enter a number between 1 - 100");
    let channel = message.mentions.channels.first();
    if (!channel) return message.channel.send("Please mention a channel.");
    await message.delete();
    let msgs
    if(!msg)
      msgs = await message.channel.fetchMessages({ limit: amount });
    else {
      msgs = await message.channel.fetchMessages({after: args[0], limit:10})
      while(!msgs.has(message.channel.lastMessageID)){
        let m = await message.channel.fetchMessages({after: msgs.first().id, limit:10})
        msgs.concat(m)
      }
    }
    let hooks = await channel.fetchWebhooks();
    let hook;
    let originals = ["IIOW SFE Move Webhook", client.user.avatarURL];
    if (hooks.size == 0)
      hook = await channel.createWebhook(originals[0], originals[1]);
    else {
      hook = hooks.first();
      console.log(hook.avatar);
      originals = [
        hook.name,
        `https://cdn.discordapp.com/avatars/${hook.id}/${hook.avatar}`
      ];
    }
    let last = null;
    let errors = 0;
    let embeds = [];
    let embed = Discord.RichEmbed;
    await hook.edit(
      `Messages moved from #${message.channel.name}`,
      "https://cdn.discordapp.com/icons/501043184361537547/a_b8f8ec6f1b3c2a6e1ae2d7d8ad59cd39.jpg"
    );
    msgs.forEach(async msg => {
      // make this a for loop
      try {
        let e = new embed()
        .setAuthor(msg.member.displayName, msg.author.avatarURL)
        .setDescription(msg.content)
        .setTimestamp(msg.createdTimestamp)
        .setColor(msg.member.displayHexColor);
        if (msg.attachments.first()) e.setImage(msg.attachments.first().url);
        if (msg.embeds[0] && msg.embeds[0].type == "image")
          e.setImage(msg.embeds[0].url);
        embeds.unshift(e);
      } catch (e) {
        console.error(e);
        errors = +1;
      }
    });
    while (embeds.length > 0) {
      let e = embeds.splice(0, 10); //ten embeds per message
      hook.send({ embeds: e });
    }
    message.channel.bulkDelete(msgs);
    message.channel.send(
      `This conversation has been moved to <#${channel.id}>`
    );
    let sentMessage = await message.channel.send(
      ` \`${msgs.size}\` messages moved.`
    );
    hook.edit(originals[0], originals[1]);
    await client.wait(3000);
    sentMessage.delete();
  } catch (e) {
    console.error(e);
  }
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator",
  hidden: true
};
exports.help = {
  name: "move",
  category: "Miscelaneous",
  description: "Move messages from one channel to another .",
  usage: "move <1-100> #channel"
};
