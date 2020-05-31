const Discord = require("discord.js");
const disallowedChannels = [];
const tech = [/*"tech", "forge"*/];
const test = [/*"test update", "beta version", "tester", "test version"*/];
const endless = [/*"endless", "end less"*/];
const sandbox = [/*"sandbox", "sand box", "creative"*/]
const responce = async (msg, id, client) => {
  if(!message.guild) return client.emit('cah', msg)
  if (msg.author.id == id) return;
  if (msg.channel.id == "674937391529590784" || msg.channel.id == '516624854066135050') return;
  if (msg.author.bot) return;
  let message;
  let content = msg.content.toLowerCase();
  client.cooldowns.ensure(msg.channel.id, {
    tech: 0,
    test: 0,
    endless: 0,
    sandbox: 0
  });
  let cooldown = 60 * 60 * 1000;
  let cooldowns = client.cooldowns.get(msg.channel.id);
  if (tech.some(word => content.includes(word))) {
    if (
      cooldowns.tech + cooldown > msg.createdTimestamp &&
      !tech.includes(msg.content)
    )
      return;
    if(content.includes('technically')) return
    message = await msg.channel.send(
      `You can no longer just place tech in items. The new way to do this is to put the item in the __output__ (bottom) section of the forge. Then you place the tech in the __input__ (upper) section. After that, click the "forge" button and the tech will be infused into the item. Tech infusion is irreversible, so be smart about what you infuse. Certain tech will not affect certain items, like trying to infuse an energy cycler (reduces energy use by 1) into a sand block.`
    );
    await message.react("💥");
    message.react("👍");
    client.cooldowns.set(msg.channel.id, msg.createdTimestamp, "tech");
  }

  if (test.some(word => content.includes(word))) {
    if (
      cooldowns.test + cooldown > msg.createdTimestamp &&
      !test.includes(msg.content)
    )
      return;
    if (
      msg.channel.id == "501046242877505538" ||
      msg.channel.id == "514096243216220200"
    )
      return;
    message = await msg.channel.send(
      "DM `tester` to <@508522609294704640> in order to access test versions of the game. Then check the <#501046242877505538> pinned messages for the link to the test version."
    );
    await message.react("💥");
    message.react("👍");
    client.cooldowns.set(msg.channel.id, msg.createdTimestamp, "test");
  }

  if (endless.some(word => content.includes(word))) {
    if (
      cooldowns.endless + cooldown > msg.createdTimestamp &&
      !endless.includes(msg.content)
    )
      return;
    message = await msg.channel.send(
      `An endless mode is planned for a __future__ update. 
**But**, Jwiggs wants to finish the story mode first to be able to release on steam.
The endless mode will __probably__ come after that, in 2020.`
    );
    await message.react("💥");
    message.react("👍");
    client.cooldowns.set(msg.channel.id, msg.createdTimestamp, "endless");
  }
  if (sandbox.some(word => content.includes(word))) {
    if (
      cooldowns.sandbox + cooldown > msg.createdTimestamp &&
      !sandbox.includes(msg.content)
    )
      return;
    message = await msg.channel.send(
      `Right click while making a new game in order to create a sandboxed game. Glitched items are made available in sandbox mode, and are in the game as experiments or are going to be removed.`
    );
    await message.react("💥");
    message.react("👍");
    client.cooldowns.set(msg.channel.id, msg.createdTimestamp, "sandbox");
  }
};
module.exports = async (client, message) => {
  if (message.author.bot && message.guild.id != "519997113648676879") return;
  if (message.guild)
    if (message.guild.id == "501043184361537547" && disallowedChannels.includes(message.channel.id))
      return responce(message, client.user.id, client);
  const settings = (message.settings =
    client.getSettings(message.guild) || client.settings.get("default"));
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  const bt = new RegExp(`/:bt.*:/i`);
  if (message.content.match(bt)) {
    console.log(message.content.slice(3, message.content.length));
  }
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
  }
  if (message.content.indexOf(settings.prefix) !== 0)
    return responce(message, client.user.id, client);
  client.saves.ensure(message.author.id, client.config.defaultUser);
  client.reminders.ensure(message.author.id, client.config.defaultReminder);
  const args = message.content
    .slice(settings.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.guild && !message.member)
    await message.guild.fetchMember(message.author);
  const level = client.permlevel(message);
  const cmd =
    client.commands.get(command) ||
    client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send(
      "This command is unavailable via private message. Please run this command in a guild."
    );
  if (client.config.blocked.includes(message.author.id))
    return message.channel.send(
      `I'm sorry, ${message.author.tag}, you are blocked from using commands!`
    );
  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel
        .send(`You do not have permission to use this command.
Your permission level is ${level} (${
        client.config.permLevels.find(l => l.level === level).name
      })
This command requires level ${client.levelCache[cmd.conf.permLevel]} (${
        cmd.conf.permLevel
      })`);
    } else {
      return;
    }
  }
  message.author.permLevel = level;
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  client.logger.cmd(
    `[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${
      message.author.username
    } (${message.author.id}) ran command ${cmd.help.name}`
  );
  try {
    cmd.run(client, message, args, level);
  } catch (error) {
    console.error(error);
    var largs = args.join(" ");
    const embed = new Discord.RichEmbed()
      .addField(
        "<a:WeeWoo:525000522932027393>**__ERROR__**<a:WeeWoo:525000522932027393>",
        `Something went wrong while trying to execute that command. Follow the steps bellow to see if that fixes you issue:`
      )
      .addField(
        "Step 1",
        "Make sure that you provided arguments that are proper. You can check what arguments are needed in the help command."
      )
      .addField(
        "Step 2",
        "Make sure the bot has the proper access to do that command."
      )
      .addField(
        "Step 3",
        `Finally if that doesn\'t work send <@517371142508380170> a message for help. It also could be I have an issue with my code and hasen't been fixed it yet.`
      )
      .addField("Error message:", `\`\`\` ${error}\`\`\``)
      .setColor("RED")
      .setTimestamp()
      .setFooter(`${client.user.username} error message`);
    message.channel.send(embed);
  }
};
