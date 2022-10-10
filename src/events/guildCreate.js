const { Client, Guild } = require('discord.js');

/**
 * Guild Create Event
 * @param {Client} client
 * @param {Guild} guild
 */
module.exports = (client, guild) => {
    client.logger.cmd(
        `[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`
    );
};
