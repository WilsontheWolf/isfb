const Discord = require("discord.js");
module.exports = async (client, messageReaction, user) => {
  let message = messageReaction.message;
  let emojiName = messageReaction.emoji.name;
  if (!["💥"].includes(emojiName)) return;
  message.author = user;
  if (emojiName == "💥") {
    if (user.id === client.user.id || user.bot || !messageReaction.me)
      return;
    message.delete();
  }

};
