const { Constants } = require('@projectdysnomia/dysnomia');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    await interaction.createMessage('Rebooting...');
    process.exit(0); // TODO: Clean reboot???
};


exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'reboot',
    description: 'Reboots the bot (if under a process manager).',
    options: undefined,
    dmPermission: true,
    nsfw: false,

};

exports.bot = {
    enabled: true,
    privileged: true,
};
