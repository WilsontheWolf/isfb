const { Client } = require("discord.js");
/**
 * Cards against humanity start handling Event
 * @param {Client} client
 * @param {string} id
 */
module.exports = async (client, id) => {
  let games = client.games
  let game = await games.get(id)
  if (!game) return console.warn(`Something tried starting game ${id} but it doesn't exist.`)
  if (game.state != 'waiting') return console.warn(`Something tried starting game ${id} but it isn't waiting.`)
  for(let i = 0;i < Object.keys(game.players).length;i++) {
    /*{
      id,
      points: 0,
      cards: [],
    }*/
    for (let i = 0; i < 8; i++)
      game.players[pid].cards.push(await getCard(id, client, 'white'))
  }
  await games.set(`${id}.players`, game.players, )
  client.emit('cahNewRound', id)
};
async function getCard(id,client, type = 'white') {
  let cards = await client.games.get(id, type)
  if (!cards) return;
  let value = client.Rnd(0, cards.length)
  let card = cards[value]
  await client.games.set(`${id}.${type}`, cards.filter((c, i) => i != value))
  return card
}