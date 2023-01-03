const Enmap = require('enmap');

const internal = new Enmap('internal');
const times = new Enmap('times');
const cards = new Enmap('cards');

const initDbs = async () => {
    internal.ensure('cardCount', 0);
    // TODO: Below when game stuff is ready.
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

module.exports = {
    internal,
    times,
    cards,
    initDbs,
};