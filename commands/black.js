const submit = (sub, e, o) => {
  let dups = 0;
  sub.forEach(s => {
    if (!check(s, e)) return dups++
    e.set(e.count + 1, {
      type: "black",
      owner: o,
      value: s
    });
  });
  return dups
};
const check = (v, e) => {
  let f = v.toLowerCase().trim().replace(/_/g, "").replace(/\./g, "").replace(/\?/g, "").replace(/!/g, "");
  let exists = e.find(p => p.value.toLowerCase().trim().replace(/_/g, "").replace(/\./g, "").replace(/\?/g, "").replace(/!/g, "") === f);
  return !exists
};

exports.run = async (client, message, args, level) => {
  if (!args[0]) return message.reply("please put your submission.");
  let submissions = args.join(" ").split("\n");
  let r = submit(submissions, client.cards, message.author.id);
  let m = `I've submitted your card${submissions.length == 1 ? '' : 's'}.`
  if(r) m =`${r} ${submissions.length == 1 ? 'submisson' : 'of your submissions'} was flagged as a duplicate and not submitted!`
  if(submissions.length - r) m +=`I've submitted the other ${submissions.length - r} submission${submissions.length - r == 1 ? '' : 's'}.`
  message.reply(m)
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
