const Discord = require("discord.js");
const { Client, MessageReaction, User } = require("discord.js");
/**
 * Reaction add Event
 * @param {Client} client
 * @param {MessageReaction} reaction
 * @param {User} user
 */
module.exports = async (client, reaction, user) => {
  let message = reaction.message;
  let emojiName = reaction.emoji.name;
  if (!["💥"].includes(emojiName)) return;
  message.author = user;
  if (emojiName == "💥") {
    if (user.id === client.user.id || user.bot || !reaction.me)
      return;
    message.delete();
  }

};
