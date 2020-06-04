module.exports = async (client, id) => {
  let games = client.game
  let game = games.get(id)
  if(!game) return console.warn(`Something tried starting game ${id} but it doesn't exist.`)
};
