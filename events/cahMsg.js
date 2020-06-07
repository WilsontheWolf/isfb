module.exports = async (client, msg) => {
  let game = client.game.find(g => g.players[msg.author.id])
  console.log(game)
  if(!game) return
  console.log('e')
};
