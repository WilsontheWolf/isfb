const Discord = require('discord.js');
const { Client } = require('discord.js');
const { getQueryHandlerAndSelector } = require('puppeteer-core');
const regex = /\({0,1}_+\){0,1}/g;
const count = (str) => {
    return ((str || '').match(regex) || []).length || 1;
};
/**
 * Cards against humanity new round handling Event
 * @param {Client} client
 * @param {string} id
 */
module.exports = async (client, id) => {
    let games = client.games;
    let game = await games.get(id);
    if (!game) return console.warn(`Something tried starting a new round in game ${id} but it doesn't exist.`);
    game.round++;
    if (game.round > 30) return client.emit('cahEnd', id);
    await games.inc(`${id}.round`);
    let black = await getCard(id, client, 'black');
    await games.set(`${id}.curBlack`, black);
    await games.set(`${id}.state`, 'picking');
    game.czar = (Object.values(game.players).find(p => p.pos === game.players[game.czar]?.pos + 1)
        || Object.values(game.players).find(p => p.pos === 0)).id;
    await games.set(`${id}.czar`, game.czar);
    for (const pid in game.players) {
        let user = await client.users.fetch(pid);
        let player = game.players[pid];
        if (player.cards.length !== 8) {
            for (let i = 0; i < 8 - player.cards.length; i++)
                player.cards.push(await getCard(id, client, 'white'));
            games.set(`${id}.players.${pid}.cards`, player.cards);
        }
        if (!user) return console.error(`Error Finding User ${pid} in game ${id}!!!
This shouldn't happen!`);
        await games.set(`${id}.players.${pid}.selected`, null);
        if (game.czar !== pid)
            user.send(new Discord.MessageEmbed()
                .setAuthor('IIslands Against Jwiggs')
                .setTitle(`Round: ${game.round}`)
                .setDescription(`**Black Card**:
${black.value.replace(regex, '`_`')}
**Your Cards**:
${player.cards.map((c, i) => `[${i + 1}] ${c.value}`).join('\n')}`)
                .addField('This round\'s czar is:', `${client.users.cache.get(game.czar)?.tag || `Unknown User (${game.czar})`}`)
                .setFooter(count(black.value) === 1 ?
                    'To select you card just send the number of it in here.' :
                    'To select you cards just send the number of them in here separated by spaces.')
            )
                .catch(e => console.error(`Error sending dm to ${user.tag} (${pid}).`, e));
        else
            user.send(new Discord.MessageEmbed()
                .setAuthor('IIslands Against Jwiggs')
                .setTitle(`Round: ${game.round}`)
                .setDescription(`**You are the Czar!**
**The black card is**:
${black.value.replace(regex, '`_`')}`)
                .setFooter('Please wait for everyone to submit...'))
                .catch(e => console.error(`Error sending dm to ${user.tag} (${pid}).`, e));
    }
    setTimeout(async () => {
        const g = await games.get(id);
        if (!g) return;
        if (g.state !== 'picking' || g.round !== game.round) return;
        client.emit('cahVote', id);
    }, 60000);
};
async function getCard(id, client, type = 'white') {
    let cards = await client.games.get(`${id}.${type}`);
    if (!cards) return;
    let value = client.Rnd(0, cards.length);
    let card = cards[value];
    await client.games.set(`${id}.${type}`, cards.filter((c, i) => i != value));
    return card;
}