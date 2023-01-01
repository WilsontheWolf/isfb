const { Constants } = require('@projectdysnomia/dysnomia');
const { setTimezone } = require('../modules/commands/time');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').ModalSubmitInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const [, ...args] = interaction.data.custom_id.split('.');
    switch (args[0]) {
    case 'timezone': {
        return setTimezone(interaction, interaction.data.components[0].components[0].value);
    }
    }

};


exports.data = {
    type: Constants.InteractionTypes.MODAL_SUBMIT,
    name: 'time',
};

exports.bot = {
    enabled: true,
    privileged: false,
};
