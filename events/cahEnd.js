const Discord = require('discord.js');

module.exports = async (client, id, reason) => {
    let games = client.games;
    let game = await games.get(id);
    if (!game) return console.warn(`Something tried ending game ${id} but it doesn't exist.`);
    let scores = {};
    await client.games.delete(id);
    for (const pid in game.players) {
        let { faction, points } = game.players[pid];
        scores[faction] = (scores[faction] || 0) + points;
    }
    client.emit('cahWSEnd', game, reason, scores);
    scores = Object.entries(scores)
        .map(([key, value]) => `**${key}**: ${value}`)
        .join('\n');
    for (const pid in game.players) {
        let user = await client.users.fetch(pid);
        if (!user) {
            console.error(`Error Finding User ${pid} in game ${game.id}!!!
This shouldn't happen!`);
            continue;
        }
        user.send(new Discord.MessageEmbed()
            .setAuthor('IIslands Against Jwiggs')
            .setTitle(`Game ended on round ${game.round}.${reason ? `\n${reason}` : ''}`)
            .addField('The scores are:', scores)
            .setColor('LUMINOUS_VIVID_PINK'))
            .catch(e => console.error(`Error sending dm to ${user.tag} (${pid}).`, e));
    }
};