const { Constants } = require('@projectdysnomia/dysnomia');
const { times } = require('../modules/dbs');
const { convertOffsetToTimezone } = require('../modules/time');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').ComponentInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const [, ...args] = interaction.data.custom_id.split('.');
    const data = times.get(interaction.user?.id);
    switch (args[0]) {
    case 'set': {
        return interaction.createModal({
            title: `Set ${args[1]}`,
            custom_id: `time.${args[1]}`,
            components: [
                {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: Constants.ComponentTypes.TEXT_INPUT,
                            custom_id: 'value',
                            label: args[1],
                            style: Constants.TextInputStyles.SHORT,
                            min_length: 2,
                            max_length: 30,
                            placeholder: 'America/Edmonton',
                            required: true,
                            value: typeof data?.offset === 'number' ? convertOffsetToTimezone(data.offset) : data?.offset,
                        },
                    ]
                }
            ]
        });
    }
    }

};


exports.data = {
    type: Constants.InteractionTypes.MESSAGE_COMPONENT,
    name: 'time',
};

exports.bot = {
    enabled: true,
    privileged: false,
};
