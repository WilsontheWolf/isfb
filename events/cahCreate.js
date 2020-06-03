module.exports = async (client) => {
  let games = client.game
  let cards = client.cards.filter(c => c.type)
  let black = cards.filter(c => c.type == 'black')
  games.set({
    white: white,
    black: black,
    players: players,
    czar: null,
    state: 'waiting'
  })
};
