const Discord = require('discord.js')
module.exports = async (client, id) => {
  let games = client.games
  let game = await games.get(id)
  if (!game) return console.warn(`Something tried starting a new round in game ${id} but it doesn't exist.`)
  await games.inc(id, 'round')
  game.round ++
  let black = await getCard(id, client, 'black')
  await games.set(`${id}.curBlack`, black, )
  let regex = /\({0,1}_+\){0,1}/g
  await games.set(`${i}.state`, 'picking')
  for(let i = 0;i < Object.keys(game.players).length;i++) {
    let user = client.users.get(pid)
    let player = game.players[pid]
    if (!user) return console.error(`Error Finding User ${pid} in game ${id}!!!
    This shouldn't happen!`)
    await games.set(`${id}.players.${pid}.selected`, null, )
    user.send(new Discord.MessageEmbed()
    .setAuthor(`IIslands Against Jwiggs`)
    .setTitle(`Round: ${game.round}`)
    .setDescription(`**Black Card**:
    ${black.value.replace(regex, '`_`')}
    **Your Cards**:
    ${player.cards.map((c,i) => `[${i+1}] ${c.value}`).join('\n')}`)
    )
  }
};
async function getCard(id, client, type = 'white') {
  let cards = await client.games.get(id, type)
  if (!cards) return;
  let value = client.Rnd(0, cards.length)
  let card = cards[value]
  await client.games.set(`${id}.${type}`, cards.filter((c, i) => i != value))
  return card
}