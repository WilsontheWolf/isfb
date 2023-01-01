const { Constants } = require('@projectdysnomia/dysnomia');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const msg = interaction.data.options?.find(o => o.name === 'msg')?.value;
    if (!msg) return interaction.createMessage('Please provide a string for me to say.');
    await interaction.createMessage(msg);
};

exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'echo',
    description: 'I say what you say!',
    options: [
        {
            name: 'msg',
            description: 'What you want me to say.',
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true,
            min_length: 1,
            max_length: 2000,
        }
    ],
    dmPermission: true,
    nsfw: false,

};

exports.bot = {
    enabled: false,
    privileged: true,
};
