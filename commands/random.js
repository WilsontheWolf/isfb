exports.run = async (client, message, args, level) => {
  let regex = /\({0,1}_+\){0,1}/
  let black = client.cards.filter(c => c.type == 'black').random() 
  let white = client.cards.filter(c => c.type == 'white').random()
  let bName = `Unknown User (${black.owner})`
  if(client.users.has(black.owner)) bName = client.users.get(black.owner).username
  let wName = `Unknown User (${white.owner})`
  if(client.users.has(black.owner)) wName = client.users.get(white.owner).username
  message.channel.send(`Black submitted by ${bName}: ${black.value}
White submitted by ${wName}: ${white.value}`)  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['rand', 'randomcard', 'iajrandom'],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "random",
  category: "Islands Against Jwiggs",
  description: "Get a random pair of black and white IIslands Against Jwiggs Cards:tm:.",
  usage: "random"
};
