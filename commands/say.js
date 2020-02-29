exports.run = async (client, message, args, level) => {
  var botmessage = message.cleanContent
    .slice(message.settings.prefix)
    .trim()
    .split(" ");
  botmessage.shift();
  botmessage = botmessage.join(" ");
  message.delete().catch(O_o => {});
  message.channel.send(botmessage);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin",
  hidden: true
};

exports.help = {
  name: "say",
  category: "Miscelaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};
