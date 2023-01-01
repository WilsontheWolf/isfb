const { Constants } = require('@projectdysnomia/dysnomia');
const { handleEval } = require('../modules/commands/eval');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').ModalSubmitInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const hidden = interaction.data.custom_id.split('.')[1] === '1';
    const code = interaction.data.components[0].components[0].value;
    await interaction.defer(hidden ? Constants.MessageFlags.EPHEMERAL : 0);

    await handleEval(interaction, code, hidden);

};


exports.data = {
    type: Constants.InteractionTypes.MODAL_SUBMIT,
    name: 'eval',
};

exports.bot = {
    enabled: true,
    privileged: true,
};
