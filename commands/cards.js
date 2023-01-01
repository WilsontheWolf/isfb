const { Constants } = require('@projectdysnomia/dysnomia');
const { getCachedData } = require('../modules/iaj/caching');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const cache = getCachedData();
    const embed = {
        title: 'Card Stats',
        fields: [
            {
                name: 'Total Cards:',
                value: `${cache.black.length + cache.white.length}`,
                inline: true,
            },
            {
                name: 'Black Cards:',
                value: `${cache.black.length}`,
                inline: true,
            },
            {
                name: 'White Cards:',
                value: `${cache.white.length}`,
                inline: true,
            },
            {
                name: 'Unique Combos:',
                value: `${cache.combos}`,
            },
        ],
    };
        
    await interaction.createMessage({ embeds: [embed] });

};


exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'cards',
    description: 'See some (maybe) interesting stats about the IAJ cards.',
    options: undefined,
    dmPermission: true,
    nsfw: false,

};

exports.bot = {
    enabled: true,
    privileged: false,
};
