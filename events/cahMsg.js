const count = (str) => {
    const re = /\({0,1}_+\){0,1}/g;
    return ((str || '').match(re) || []).length || 1;
};
const Discord = require('discord.js');
const regex = /\({0,1}_+\){0,1}/;

async function getCard(id, client, type = 'white') {
    let cards = await client.games.get(`${id}.${type}`);
    if (!cards) return;
    let value = client.Rnd(0, cards.length);
    let card = cards[value];
    await client.games.set(`${id}.${type}`, cards.filter((c, i) => i != value));
    return card;
}
const { Client, Message } = require('discord.js');
/**
 * Cards against humanity message handling Event
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    if (message.channel.type !== 'dm') return;
    if (message.content.startsWith('-')) return;
    let game = await client.games.find(g => g.players[message.author.id]);
    if (!game) return;
    game = game[Object.keys(game)[0]];
    const player = game.players[message.author.id];
    if (!player.enabled) return message.reply(`You currently are in a game but not participating.
If you want to rejoin the game run the command \`-iaj join ${game.id}\``);
    let c = count(game.curBlack.value);
    if (message.content == 'leave') {
        await client.games.set(`${game.id}.players.${message.author.id}.enabled`, false,);
        message.reply('You have left this game.');
    } else {
        const args = message.content
            .trim()
            .split(/ +/g);
        if (game.state == 'picking' && game.czar != message.author.id && !player.selected) {
            let sub = [];
            for (let i = 0; i < c; i++) {
                let num = parseInt(args[i]);
                if (isNaN(num)) i = c;
                else if (num > player.cards.length || num < 1) i = c;
                else if (sub.includes(num)) i = c;
                else sub.push(num);
            }
            if (sub.length != c) return message.reply(`Please choose \`${c}\` valid choice${c === 1 ? '' : 's'}.`);
            player.selected = [];
            for (const s of sub) {
                player.selected.push(player.cards[s - 1]);
                player.cards[s - 1] = await getCard(game.id, client, 'white');
            }
            await client.games.set(`${game.id}.players.${player.id}`, player);
            let filled = game.curBlack.value;
            if (!filled.match(regex))
                filled = `${filled} **${player.selected[0].value}**`;
            else
                for (const s of player.selected)
                    filled = filled.replace(regex, `**${s.value}**`);
            message.author.send(new Discord.MessageEmbed()
                .setAuthor('IIslands Against Jwiggs')
                .setTitle(`I've submitted your card for round ${game.round}`)
                .setDescription(`**Filled in card**:
${filled}`)
                .setFooter('Please wait for everyone to submit...'))
                .catch(e => console.error(`Error sending dm to ${message.author.tag} (${player.id}).`, e));
            if (Object.values(game.players).every(p => p.selected || game.czar === p.id)) client.emit('cahVote', game.id);
        } else if (game.state == 'picking' && game.czar != message.author.id && player.selected) {
            return message.channel.send('You have already submitted for this round.');
        } else if (game.state == 'voting' && game.czar === message.author.id) {
            const cards = await client.games.get(`${game.id}.choices`);
            if (!cards) return message.reply('I\'m sorry something went terribly wrong. Please try again.');
            let num = parseInt(message.content);
            if (isNaN(num)) return message.reply('Please choose a valid number.');
            else if (num > cards.length || num < 1) return message.reply('Please choose a number in valid range.');
            const win = cards[num - 1];
            client.games.set(`${game.id}.state`, 'displaying');
            client.games.inc(`${game.id}.players.${win.player}.points`);
            game.players[win.player].points++;
            let scores = {};
            for (const pid in game.players) {
                let { faction, points } = game.players[pid];
                scores[faction] = (scores[faction] || 0) + points;
            }
            scores = Object.entries(scores)
                .map(([key, value]) => `**${key}**: ${value}`)
                .join('\n');
            for (const pid in game.players) {
                let user = await client.users.fetch(pid);
                if (!user) {
                    console.error(`Error Finding User ${game.czar} in game ${game.id}!!!
This shouldn't happen!`);
                    continue;
                }
                user.send(new Discord.MessageEmbed()
                    .setAuthor('IIslands Against Jwiggs')
                    .setTitle(`Final card selected for round ${game.round}`)
                    .setDescription(`**The winning card is**:
${win.filled}`)
                    .addField('The winner is:', `${client.users.cache.get(win.player)?.tag || `Unknown User (${win.player})`} (${game.players[win.player].faction})`)
                    .addField('The scores are:', scores))
                    .catch(e => console.error(`Error sending dm to ${user.tag} (${pid}).`, e));
            }
            setTimeout(() => {
                client.emit('cahNewRound', game.id);
            }, 5000);
        }
    }
};
