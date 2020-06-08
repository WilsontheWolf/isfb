module.exports = async (client, msg) => {
  if (msg.content.startsWith('-')) return;
  let game = client.game.find(g => g.players[msg.author.id])
  console.log(game)
  if (!game) return
  if(game.state == 'picking')
};
