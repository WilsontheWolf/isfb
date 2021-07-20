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
    for (const game of await client.games.values){
        if (game.state === 'waiting') continue;
        else if (game.state === 'displaying') setTimeout(() => {
            client.emit('cahNewRound', game.id);
        }, 5000);
        else if (game.state === 'voting') setTimeout(async () => {
            const g = await client.games.get(game.id);
            if (!g) return;
            if (g.state !== 'voting' || g.round !== game.round) return;
            client.emit('cahNewRound', game.id);
        }, 30000);
        else if (game.state === 'picking') setTimeout(async () => {
            const g = await client.games.get(game.id);
            if (!g) return;
            if (g.state !== 'picking' || g.round !== game.round) return;
            client.emit('cahVote', game.id);
        }, 30000);
    }
};
