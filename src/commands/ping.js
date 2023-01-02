const { Constants } = require('@projectdysnomia/dysnomia');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    await interaction.defer();
    const msg = await interaction.editOriginalMessage('Ping?');
    msg.edit(
        `🏓Pong! Latency is ${msg.createdAt - interaction.createdAt}ms. API Latency is ${client.shards.find(s => s)?.latency || '???'}ms`
    );
};


exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'ping',
    description: 'Pong! See the latency of the bot.',
    options: undefined,
    dmPermission: true,
    nsfw: false,

};

exports.bot = {
    enabled: true,
    privileged: false,
};
