const { Constants } = require('@projectdysnomia/dysnomia');
const { times } = require('../dbs');
const { validateTimezone } = require('../time');

/**
 * Set a timezone for a user.
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction | import('@projectdysnomia/dysnomia').ModalSubmitInteraction} interaction - The interaction to use
 * @param {string} timezone - The timezone to set
 */
const setTimezone = async (interaction, timezone) => {
    const user = interaction.user?.id;
    if (!user) return interaction.createMessage({
        content: "I'm sorry, an error occurred!",
        flags: Constants.MessageFlags.EPHEMERAL,
    });

    const { valid, msg: invalidMsg } = validateTimezone(timezone);
    if (!valid) {
        return interaction.createMessage({
            content: `I'm sorry, that timezone doesn't seem to be valid! Considering looking up your timezone.
${invalidMsg ? `Message: ${invalidMsg?.message || invalidMsg}` : ''}`,
            flags: Constants.MessageFlags.EPHEMERAL,
            components: [
                {
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: Constants.ComponentTypes.BUTTON,
                            label: 'Find My Timezone',
                            url: 'https://tools.shorty.systems/timezone',
                            style: Constants.ButtonStyles.LINK,
                        },
                        {
                            type: Constants.ComponentTypes.BUTTON,
                            label: 'Set The Timezone',
                            style: Constants.ButtonStyles.PRIMARY,
                            custom_id: 'time.set.timezone',
                        },
                    ]
                }
            ]

        });
    }

    times.set(user, timezone, 'offset');
    await interaction.createMessage({
        content: `Got it! Successfully set your timezone to \`${timezone}\`.`,
        flags: Constants.MessageFlags.EPHEMERAL,
    });
};

module.exports = {
    setTimezone,
};