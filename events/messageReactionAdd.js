const Discord = require("discord.js");
module.exports = async (client, messageReaction, user) => {
  const save = client.commands.get("save");
  const stats = client.commands.get("stats");
  const authorid = messageReaction.message.author.id
  let message = messageReaction.message;
  let emojiName = messageReaction.emoji.name;
  if (
    emojiName != "💾" &&
    emojiName != "❓" &&
    emojiName != "❔" &&
    emojiName != "💥" && 
    emojiName != "👍"
  )
    return;
  message.author = user;
  if (message.guild) message.member = message.guild.members.get(user.id);
  if (emojiName == "💾") {
    if (!message.attachments.first()) return;
  let url = message.attachments.first().url;
    let slot = await client.awaitReply(message, `<@${message.author.id}>, in which slot would you like to save this file?`);
    let args = [slot, url];
    save.run(client, message, args);
  } else if (emojiName == "❓" || emojiName == "❔") {
    if (!message.attachments.first()) return;
  let url = message.attachments.first().url;
    let args = [url];
    stats.run(client, message, args);
  } else if (emojiName == "💥") {
    if (authorid != client.user.id || user.bot || !messageReaction.me)
      return;
    message.delete();
  }
  else if (emojiName == "👍") {
    if (authorid != client.user.id || user.bot || !messageReaction.me)
      return;
    let boom = message.reactions.get("💥") 
    if(boom)boom.remove()
  }
};
