const express = require('express');
const { Client } = require('discord.js');
/**
 * Ready Event
 * @param {Client} client
 */
module.exports = async client => {
    client.settings.ensure('default', client.config.defaultSettings);
    client.user.setActivity('Preparing...', { type: 'PLAYING' });
    client.logger.log(
        `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`,
        'ready'
    );
    client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {
        type: 'PLAYING'
    });
    client.internal.ensure('cardCount', 0);
};
