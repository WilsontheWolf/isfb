module.exports = async (client, msg) => {
  if (msg.content.startsWith('-')) return;
  let game = client.game.find(g => g.players[msg.author.id])
  console.log(game)
  if (!game) return
  player = game.players[msg.author.id]
  if (game.state == 'picking' && game.czar != msg.author.id && !player.selected) {
    // {
    //   id: message.author.id,
    //   points: 0,
    //   selected: null,
    //   cards: [],
    //   faction
    // }
  };

};
