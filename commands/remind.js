const moment = require("moment");
exports.run = async (client, message, args, level) => {
  let timemeasure;
  let returntime;
  timemeasure = args[0].substring(args[0].length - 1, args[0].length);
  returntime = args[0].substring(0, args[0].length - 1);
  // Based off the delimiter, sets the time
  switch (timemeasure) {
    case "s":
      returntime = returntime * 1000;
      break;
    case "m":
      returntime = returntime * 1000 * 60;
      break;
    case "h":
      returntime = returntime * 1000 * 60 * 60;
      break;
    case "d":
      returntime = returntime * 1000 * 60 * 60 * 24;
      break;
    default:
      returntime = returntime * 1000;
      break;
  }
  console.log(returntime);
  if (!returntime) return message.channel.send("Not a valid time!");
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: true
};
exports.help = {
  name: "remind",
  category: "Miscelaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};
