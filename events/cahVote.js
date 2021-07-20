const Discord = require('discord.js');
const regex = /\({0,1}_+\){0,1}/;

module.exports = async (client, id) => {
    let games = client.games;
    let game = await games.get(id);
    if (!game) return console.warn(`Something tried starting voting on game ${id} but it doesn't exist.`);
    if (game.state != 'picking') return console.warn(`Something tried starting voting on game ${id} but it isn't picking.`);
    if (!game.czar) return console.error(`Someone tried starting voting on game ${id} but there is no czar. This game is probably screwed and will need manual fixing!`);
    client.games.set(`${id}.state`, 'voting');
    client.emit('cahWSUpdate', game.id);
    let czar = await client.users.fetch(game.czar);
    if (!czar) return console.error(`Error Finding Czar User ${game.czar} in game ${id}!!!
This shouldn't happen!`);
    let cards = [];
    for (const pid in game.players) {
        if (pid === game.czar) continue;
        let player = game.players[pid];
        if (!player?.selected) continue;
        // If the player left and then rejoined this round this happens.
        if (!player.selected.length) continue;
        let filled = game.curBlack.value;
        if (!filled.match(regex))
            filled = `${filled} **${player.selected[0].value}**`;
        else
            for (const s of player.selected)
                filled = filled.replace(regex, `**${s.value}**`);
        cards.push({
            player: pid,
            cards: player.selected.map(({ value }) => value),
            filled
        });
    }
    // Shuffle order to prevent cheating.
    cards = cards.sort(() => 0.5 - Math.random());
    await client.games.set(`${id}.choices`, cards);
    if (!cards.length) {
        await client.games.set(`${game.id}.state`, 'displaying');
        client.emit('cahWSLose', game.id, 'cards');
        for (const pid in game.players) {
            if (!game.players[pid].enabled) continue;
            let user = await client.users.fetch(pid);
            if (!user) {
                console.error(`Error Finding User ${game.czar} in game ${id}!!!
This shouldn't happen!`);
                continue;
            }
            user.send(new Discord.MessageEmbed()
                .setAuthor('IIslands Against Jwiggs')
                .setTitle(`Round: ${game.round}`)
                .setDescription('There were no cards submitted! No one wins this round.')
                .setColor('RED'))
                .catch(e => console.error(`Error sending dm to ${user.tag} (${pid}).`, e));
        }
        setTimeout(() => {
            client.emit('cahNewRound', game.id);
        }, 5000);
    }
    else {
        for (const pid in game.players) {
            if (!game.players[pid].enabled) continue;
            if (pid === czar.id) continue;
            let user = await client.users.fetch(pid);
            if (!user) {
                console.error(`Error Finding User ${game.czar} in game ${id}!!!
This shouldn't happen!`);
                continue;
            }
            user.send(new Discord.MessageEmbed()
                .setAuthor('IIslands Against Jwiggs')
                .setTitle(`Round: ${game.round}`)
                .setDescription('The czar is now picking cards. Please wait...')
                .setColor('ORANGE'))
                .catch(e => console.error(`Error sending dm to ${user.tag} (${pid}).`, e));
        }
        czar.send(new Discord.MessageEmbed()
            .setAuthor('IIslands Against Jwiggs')
            .setTitle(`Round: ${game.round}`)
            .setDescription('Please select your favourite!')
            .addFields(cards.map(({ filled }, i) => ({
                name: `#${i + 1}:`,
                value: filled,
                inline: true
            })))
            .setColor('GREY'))
            .catch(e => console.error(`Error sending dm to ${czar.tag} (${czar.id}).`, e));
    }
    setTimeout(async () => {
        const g = await games.get(id);
        if (!g) return;
        if (g.state !== 'voting' || g.round !== game.round) return;
        // Show user's czar chose nothing.
        await client.games.set(`${game.id}.state`, 'displaying');
        client.emit('cahWSLose', game.id, 'czar');
        for (const pid in game.players) {
            if (!game.players[pid].enabled) continue;
            let user = await client.users.fetch(pid);
            if (!user) {
                console.error(`Error Finding User ${game.czar} in game ${id}!!!
This shouldn't happen!`);
                continue;
            }
            user.send(new Discord.MessageEmbed()
                .setAuthor('IIslands Against Jwiggs')
                .setTitle(`Round: ${game.round}`)
                .setDescription('The czar didn\'t pick a card! No one wins this round.')
                .setColor('RED'))
                .catch(e => console.error(`Error sending dm to ${user.tag} (${pid}).`, e));
        }
        setTimeout(() => {
            client.emit('cahNewRound', game.id);
        }, 5000);
    }, 30000);
};