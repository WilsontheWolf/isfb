const { Constants } = require('@projectdysnomia/dysnomia');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const subCommand = interaction.data.options?.[0];
    if (!subCommand) return interaction.createMessage({ content: 'Something went wrong!!!', flags: Constants.MessageFlags.EPHEMERAL });
    switch (subCommand.name) {
    case 'create': {
        // const user = subCommand.options?.[0]?.value || interaction.user?.id;
        await interaction.createMessage({
            content: 'WIP',
            flags: Constants.MessageFlags.EPHEMERAL,
        });
        break;
    }
    }
};

exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'iaj',
    description: 'IAJ game tools!',
    options: [
        {
            name: 'create',
            description: 'Create a new game. (Admin only)',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: []
        },
    ],
    dmPermission: true,
    nsfw: false,

};

exports.bot = {
    enabled: false,
    privileged: false,
};
