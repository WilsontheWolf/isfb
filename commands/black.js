const submit = (sub, e, o) => {
  let stats = [];
  sub.forEach(s => {
    if (!check(s, e)) return stats.push('dup');
    e.set(e.autonum, {
      type: "black",
      owner: o,
      value: s
    });
    
  });
};
const check = (v, e) => {
  let f = v.toLowerCase().replace(/_/g, "");
};

exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply("please put your submission");
  let submissions = args.join(" ").split("\n");
  submit(submissions, client.cards, message.author.id);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner",
  hidden: true
};

exports.help = {
  name: "black",
  category: "IIslands Against Jwiggs",
  description:
    "Submit a black card. Several can be submitted by seperating them with a new line.",
  usage: "black [submissons]"
};
