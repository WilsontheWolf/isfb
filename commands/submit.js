const { Constants } = require('@projectdysnomia/dysnomia');
const { checkForDuplicates } = require('../modules/iaj/caching');
const { addCard } = require('../modules/iaj/data');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const subCommand = interaction.data.options?.[0];
    if (!subCommand) return interaction.createMessage({ content: 'Something went wrong!!!', flags: Constants.MessageFlags.EPHEMERAL });
    const type = subCommand.name;
    const value = subCommand.options?.[0].value;
    if(!value) return interaction.createMessage({ content: 'Please provide a value!', flags: Constants.MessageFlags.EPHEMERAL });
    const isDup = checkForDuplicates(type, value);
    if(isDup) return interaction.createMessage({ content: 'That card was flagged as a duplicate!', flags: Constants.MessageFlags.EPHEMERAL });
    addCard({
        value,
        owner: interaction.user.id,
        type,
    });
    await interaction.createMessage({ content: 'Card submitted!', flags: Constants.MessageFlags.EPHEMERAL });
};

exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'submit',
    description: 'Submit an IAJ card!',
    options: [
        {
            name: 'black',
            description: 'Submit a black card.',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: 'value',
                    description: 'The value of the new black card you wish to submit.',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true,
                    min_length: 1,
                    max_length: 500,
                },
            ]
        },
        {
            name: 'white',
            description: 'Submit a white card.',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: 'value',
                    description: 'The value of the new white card you wish to submit.',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true,
                    min_length: 1,
                    max_length: 100,
                },
            ]
        },
    ],
    dmPermission: true,
    nsfw: false,

};

exports.bot = {
    enabled: true,
    privileged: false,
};
