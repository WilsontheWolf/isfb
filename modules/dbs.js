const Enmap = require('enmap');
const config = require('../config');

const settings = new Enmap('settings');
const internal = new Enmap('internal');

const initDbs = async () => {
    settings.ensure('default', config.defaultSettings);
    internal.ensure('cardCount', 0);
    // for (const game of await games.values){
    //     if (game.state === 'waiting') continue;
    //     else if (game.state === 'displaying') setTimeout(() => {
    //         client.emit('cahNewRound', game.id);
    //     }, 5000);
    //     else if (game.state === 'voting') setTimeout(async () => {
    //         const g = await games.get(game.id);
    //         if (!g) return;
    //         if (g.state !== 'voting' || g.round !== game.round) return;
    //         client.emit('cahNewRound', game.id);
    //     }, 30000);
    //     else if (game.state === 'picking') setTimeout(async () => {
    //         const g = await games.get(game.id);
    //         if (!g) return;
    //         if (g.state !== 'picking' || g.round !== game.round) return;
    //         client.emit('cahVote', game.id);
    //     }, 30000);
    // }
};

/** @param {import('eris').Guild} guild */
const getSettings = guild => {
    if (!guild) return settings.get('default');
    const guildConf = settings.get(guild.id) || {};
    return { ...settings.get('default'), ...guildConf };
};

module.exports = {
    settings,
    internal,
    initDbs,
    getSettings,
};