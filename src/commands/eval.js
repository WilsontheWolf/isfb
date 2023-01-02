const { Constants } = require('@projectdysnomia/dysnomia');
const { handleEval } = require('../modules/commands/eval');

/**
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
const handleModal = async (interaction) => {
    const hidden = interaction.data.options[0].options?.find(o => o.name === 'hidden')?.value;
    await interaction.createModal({
        title: 'Eval',
        custom_id: `eval.${hidden ? 1 : 0}`,
        components: [{
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [
                {
                    custom_id: 'code',
                    label: 'Code',
                    style: Constants.TextInputStyles.PARAGRAPH,
                    type: Constants.ComponentTypes.TEXT_INPUT,
                    required: true,
                    placeholder: '"Hello World"',
                }
            ]
        }
        ]
    });
};

/**
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
const handleInline = async (interaction) => {
    const hidden = interaction.data.options[0].options?.find(o => o.name === 'hidden')?.value;
    const code = interaction.data.options[0].options?.find(o => o.name === 'code')?.value;
    await interaction.defer(hidden ? Constants.MessageFlags.EPHEMERAL : 0);

    await handleEval(interaction, code, hidden);
};

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const subCommand = interaction.data.options?.[0];
    if (!subCommand) return interaction.createMessage({ content: 'Something went wrong!!!', flags: Constants.MessageFlags.EPHEMERAL });
    if (subCommand.name === 'modal') return handleModal(interaction);
    else if (subCommand.name === 'inline') return handleInline(interaction);
};

exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'eval',
    description: 'Run code!',
    options: [
        {
            name: 'inline',
            description: 'Run code in the slash command.',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: 'code',
                    description: 'What you want me to run.',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true,
                },
                {
                    name: 'hidden',
                    description: 'Whether or not the command is ephemeral or not.',
                    type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
                    required: false,
                },
            ]
        },
        {
            name: 'modal',
            description: 'Run code in a modal.',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: 'hidden',
                    description: 'Whether or not the command is ephemeral or not.',
                    type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
                    required: false,
                },
            ]
        },
    ],
    dmPermission: true,
    nsfw: false,

};

exports.bot = {
    enabled: true,
    privileged: true,
};
