exports.run = async (client, message, args, level) => {
  const msg = await message.channel.send("Ping?");
  msg.edit(
    `🏓Pong! Latency is ${msg.createdTimestamp -
      message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: true
};

exports.help = {
  name: "ping",
  category: "Miscelaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};
