const submit = (sub, e, o) => {
  let stats = [];
  sub.forEach(s => {
    if (!check(s, e)) return stats.push('dup');
    e.set(e.autonum, {
      type: "black",
      owner: o,
      value: s
    });
    stats.push('ok')
  });
  return stats
};
const check = (v, e) => {
  let f = v.toLowerCase().trim().replace(/_/g, "").replace(/\./g, "").replace(/\?/g, "").replace(/!/g, "");
  let exists = e.find(p => p.value.toLowerCase().trim().replace(/_/g, "").replace(/\./g, "").replace(/\?/g, "").replace(/!/g, "") === f);
  return !exists
};

exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply("please put your submission");
  let submissions = args.join(" ").split("\n");
  let r = submit(submissions, client.cards, message.author.id);
  if(r.includes('dup')) return message.reply('one or more of your submissions was flagged as a duplicate and not submitted!');
  message.reply("I've submitted your cards.")
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
