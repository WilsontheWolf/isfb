module.exports = async (client, id) => {
  let games = client.game
  let game = games.get(id)
  if (!game) return console.warn(`Something tried starting game ${id} but it doesn't exist.`)
  Object.keys(game.players).forEach(pid => {
      let user = client.users.get(pid)
      if(!user) return console.error(`Error Finding User ${pid}!!!`)
      
  })
};
function getCard(id,client, type = 'white') {
  let cards = client.game.get(id, type)
  if (!cards) return;
  let value = client.Rnd(0, cards.length)
  let card = cards[value]
  client.game.set(id, cards.filter((c, i) => i != value), type)
  return card
}