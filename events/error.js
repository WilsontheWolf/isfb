const { Client } = require("discord.js");

/**
 * Error Event
 * @param {Client} client
 * @param {Error} error
 */
module.exports = async (client, error) => {
  client.logger.log(
    `An error event was sent by Discord.js: \n${JSON.stringify(error)}`,
    "error"
  );
};
