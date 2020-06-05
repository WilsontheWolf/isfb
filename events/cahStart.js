module.exports = async (client, id) => {
  let games = client.game
  let game = games.get(id)
  if (!game) return console.warn(`Something tried starting game ${id} but it doesn't exist.`)
  if (game.state != 'waiting') return console.warn(`Something tried starting game ${id} but it isn't waiting.`)
  Object.keys(game.players).forEach(pid => {
    /*{
      id,
      points: 0,
      cards: [],
    }*/
    for (let i = 0; i < 8; i++)
      game.players[pid].cards.push(getCard(id, client, 'white'))
  })
  games.set(id, game.players, 'players')
  games.set(id, 'picking', 'state')
  client.emit('cahNewRound', id)
};
function getCard(id,client, type = 'white') {
  let cards = client.game.get(id, type)
  if (!cards) return;
  let value = client.Rnd(0, cards.length)
  let card = cards[value]
  client.game.set(id, cards.filter((c, i) => i != value), type)
  return card
}