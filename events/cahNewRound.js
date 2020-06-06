const Discord = require('discord.js')
module.exports = async (client, id) => {
  let games = client.game
  let game = games.get(id)
  if (!game) return console.warn(`Something tried starting a new round in game ${id} but it doesn't exist.`)
  games.inc(id, 'round')
  game.round ++
  let black = getCard(id, client, 'black')
  games.set(id, black, 'curBlack')
  let regex = /\({0,1}_+\){0,1}/g
  Object.keys(game.players).forEach(pid => {
    let user = client.users.get(pid)
    let player = game.players[pid]
    if (!user) return console.error(`Error Finding User ${pid} in game ${id}!!!
    This shouldn't happen!`)
    user.send(new Discord.RichEmbed()
    .setAuthor(`IIslands Against Jwiggs`)
    .setTitle(`Round: ${game.round}`)
    .setDescription(`**Black Card**:
    ${black.value.replace(regex, '`_`')}
    **Your Cards**:
    ${player.cards.map((c,i) => `[${i+1}] ${c.value}`).join('\n')}`)
    )
  })
};
function getCard(id, client, type = 'white') {
  let cards = client.game.get(id, type)
  if (!cards) return;
  let value = client.Rnd(0, cards.length)
  let card = cards[value]
  client.game.set(id, cards.filter((c, i) => i != value), type)
  return card
}