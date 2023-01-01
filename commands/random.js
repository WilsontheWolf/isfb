const { Constants } = require('@projectdysnomia/dysnomia');
const { randomEmbedColor } = require('../modules/constants');
const { cards } = require('../modules/dbs');
const { randFromArray } = require('../modules/functions');
const { getCachedData } = require('../modules/iaj/caching');
const { replaceSpaces, countSpaces } = require('../modules/iaj/parsing');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    if (!interaction.user) return interaction.createMessage({ content: 'Something is funky!', flags: Constants.MessageFlags.EPHEMERAL });
    const userBlack = interaction.data.options?.find(o => o.name === 'black')?.value;
    const userWhite = interaction.data.options?.find(o => o.name === 'white')?.value;
    const cache = getCachedData();
    let black;
    if (!userBlack) black = cards.get(randFromArray(cache.black));
    else
        black = {
            value: userBlack,
            owner: interaction.user.id,
            type: 'black',
        };

    let white = [];
    if (userWhite) white = userWhite.split(',').map(w => ({
        value: w,
        owner: interaction.user.id,
        type: 'white',
    }));


    const count = countSpaces(black.value);
    if (white.length < count) {
        const toGet = count - white.length;
        white.push(...[randFromArray(cache.white, toGet)].flat().map(c => cards.get(c)));
    }

    const text = replaceSpaces(black.value, white.map(w => w.value));
    const embed = {
        title: 'Random IIslands Against Jwiggs Combo',
        description: text,
        color: randomEmbedColor(),
        fields: [
            {
                name: 'Black Card Submitted By:',
                value: `<@${black.owner}>`,
                inline: true,
            },
            {
                name: `White Card${white.length === 1 ? '' : 's'} Submitted By:`,
                value: white.map(w => `<@${w.owner}>`).filter((v, i, a) => a.indexOf(v) === i).join(', '),
                inline: true,
            },
        ],
    };
    await interaction.createMessage({ embeds: [embed] });
};

exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'random',
    description: 'Get a random IIslands Against Jwiggs combo.',
    options: [
        {
            name: 'black',
            description: 'Optional. Specify the black card.',
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false,
            min_length: 1,
            max_length: 500,
        },
        {
            name: 'white',
            description: 'Optional. Specify the white card(s). Separate multiple cards with a comma.',
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false,
            min_length: 1,
            max_length: 500
        }
    ],
    dmPermission: true,
    nsfw: false,

};

exports.bot = {
    enabled: true,
    privileged: false,
};
