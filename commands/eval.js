const Discord = require("discord.js");
const enmap = require("enmap");
exports.run = async (client, message, args, level) => {
  let silent = false;
  if (message.flags.includes("s")) {
    silent = true;
  }
  if (message.flags.includes("d")) {
    message.delete().catch(O_o =>{});
  }
  const code = args.join(" ");
  let msg
  try {
    var evaled;
    if (code.includes("await") && !message.content.includes("\n"))
      evaled = await eval("( async () => {return " + code + "})()");
    else if (code.includes("await") && message.content.includes("\n"))
      evaled = await eval("( async () => {" + code + "})()");
    else evaled = await eval(code);
    if (typeof evaled !== "string") {
      var evaled = require("util").inspect(evaled, { depth: 3 });
    }
  } catch (err) {
    if (typeof err !== "string") {
      err = err.toString()
    }
    var length = `\`\`\`${err}\`\`\``.length;
    var embedErr = new Discord.RichEmbed()
      .setColor("RED")
      .setTitle("**Error**")
      .setFooter(`Eval command executed by ${message.author.username}`)
      .setDescription(`\`\`\`${err.substr(0, 2042)}\`\`\``)
      .setTimestamp();
    if (length >= 2049) {
      console.error(`An eval command executed by ${message.author.username}'s error was too long \(${length}/2048\) the responce was:
${evaled}`);
      embedErr.addField(
        "Note:",
        `The error was too long with a length of \`${length}/2048\` characters. it was logged to the console`
      );
    } else {
      embedErr.setDescription(`\`\`\`${err}\`\`\``);
    }
    if (!silent) msg = await message.channel.send(embedErr);
    msg.react('💥')
    return;
  }
  var length = `\`\`\`${evaled}\`\`\``.length;
  var embed = new Discord.RichEmbed()
    .setColor("GREEN")
    .setTitle("**Success**")
    .setFooter(`eval command executed by ${message.author.username}`)
    .setTimestamp()
    .setDescription(`\`\`\`${evaled.substr(0, 2042)}\`\`\``);
  if (length >= 2049) {
    console.log(`An eval command executed by ${message.author.username}'s responce was too long \(${length}/2048\) the responce was:
${evaled}`);
    embed.addField(
      "Note:",
      `The responce was too long with a length of \`${length}/2048\` characters. it was logged to the console`
    );
  }
  if (!silent) msg = await message.channel.send(embed);
  msg.react('💥')
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin",
  hidden: true
};
exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
