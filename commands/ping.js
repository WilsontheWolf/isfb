/**
 * @param {import('eris').Client} client
 * @param {import('eris').Message} message
 * @param {String[]} args
 */
exports.run = async (client, message, args) => {
    const msg = await message.channel.send('Ping?');
    msg.edit(
        `🏓Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    privileged: false,
    hidden: true
};

exports.help = {
    name: 'ping',
    category: 'Miscelaneous',
    description: 'It like... Pings. Then Pongs. And it\'s not Ping Pong.',
    usage: 'ping'
};
