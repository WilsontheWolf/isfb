const { Constants } = require('@projectdysnomia/dysnomia');
const { setTimezone } = require('../modules/commands/time');
const { times } = require('../modules/dbs');
const { convertOffsetToTimezone, timezoneToDisplayTime, isPastBedtime, convertTimeStringToHours } = require('../modules/time');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client
 * @param {import('@projectdysnomia/dysnomia').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
    const subCommand = interaction.data.options?.[0];
    if (!subCommand) return interaction.createMessage({ content: 'Something went wrong!!!', flags: Constants.MessageFlags.EPHEMERAL });
    switch (subCommand.name) {
    case 'get': {
        const user = subCommand.options?.[0]?.value || interaction.user?.id;
        const data = times.get(user);
        if (!data?.offset) return interaction.createMessage({ content: "This user doesn't have any data.", flags: Constants.MessageFlags.EPHEMERAL });
        let timezone = data.offset;
        if (typeof data.offset === 'number') timezone = convertOffsetToTimezone(data.offset);
        const time = timezoneToDisplayTime(timezone, interaction.locale || interaction.guild_locale);
        const pastBedtime = data.bedtime ? isPastBedtime(timezone, ...data.bedtime) : false;
        return interaction.createMessage({ content: `The current time for <@${user}> is \`${time}\`.\n${pastBedtime ? `It's past <@${user}>'s set bedtime.` : ''}` });
    }
    case 'set': {
        const subCommandGroup = subCommand.options?.[0];
        if (!subCommandGroup) return interaction.createMessage({ content: 'Something went wrong!!!', flags: Constants.MessageFlags.EPHEMERAL });
        switch (subCommandGroup.name) {
        case 'timezone': {
            const timezone = subCommandGroup.options?.[0]?.value;
            if (!timezone) {
                // TODO: Wordy
                return interaction.createMessage({
                    content: 'To get your timezone, you may look at the following resource. Once you got it, click the submit button, or run the command again with the timezone.',
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
                                    label: 'Submit',
                                    style: Constants.ButtonStyles.PRIMARY,
                                    custom_id: 'time.set.timezone',
                                },
                            ]
                        }
                    ]
                });
            }
            return setTimezone(interaction, timezone);
        }
        case 'bedtime': {
            const bedtimeOptions = subCommandGroup.options;
            const start = bedtimeOptions?.find(o => o.name === 'start')?.value;
            const end = bedtimeOptions?.find(o => o.name === 'end')?.value;
            if (!start || !end) return interaction.createMessage({ content: 'Something went wrong!!!', flags: Constants.MessageFlags.EPHEMERAL });
            const startTime = convertTimeStringToHours(start);
            if (startTime === null) return interaction.createMessage({ content: 'Your start time is malformed! Please try again.', flags: Constants.MessageFlags.EPHEMERAL });
            const endTime = convertTimeStringToHours(end);
            if (endTime === null) return interaction.createMessage({ content: 'Your end time is malformed! Please try again.', flags: Constants.MessageFlags.EPHEMERAL });
            times.set(interaction.user?.id, [startTime, endTime], 'bedtime');
            if(interaction.locale) times.set(interaction.user?.id, interaction.locale, 'locale');
            return interaction.createMessage({ content: 'Your bedtime has been set!', flags: Constants.MessageFlags.EPHEMERAL });
        }
        }
        break;
    }
    case 'clear': {
        const subCommandGroup = subCommand.options?.[0];
        if (!subCommandGroup) return interaction.createMessage({ content: 'Something went wrong!!!', flags: Constants.MessageFlags.EPHEMERAL });
        switch (subCommandGroup.name) {
        case 'bedtime': {
            times.set(interaction.user?.id, null, 'bedtime');
            times.set(interaction.user?.id, null, 'locale');
            return interaction.createMessage({ content: 'Your bedtime has been cleared!', flags: Constants.MessageFlags.EPHEMERAL });
        }
        case 'timezone': {
            times.set(interaction.user?.id, null, 'offset');
            return interaction.createMessage({ content: 'Your timezone has been cleared!', flags: Constants.MessageFlags.EPHEMERAL });
            
        }
        }
        break;
    }
    }
};

exports.slash = {
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    name: 'time',
    description: 'Timezone talk.',
    options: [
        {
            name: 'get',
            description: 'Get the time information for a specific user.',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
                {
                    name: 'user',
                    description: 'Who you want timezone info for. Defaults to you.',
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    required: false,
                },
            ]
        },
        {
            name: 'set',
            description: 'Set information about your time.',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
            options: [
                {
                    name: 'timezone',
                    description: 'Set your timezone.',
                    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: 'timezone',
                            description: "The timezone you want to set. Leave this blank and I'll walk you through finding your timezone.",
                            type: Constants.ApplicationCommandOptionTypes.STRING,
                            required: false,
                            min_length: 0,
                            max_length: 50,
                        },
                    ],
                },
                {
                    name: 'bedtime',
                    description: 'Set your bedtime.',
                    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: 'start',
                            description: 'The local time to start your bedtime. Use `HH:MM` for 24h time and `HH:MM AM/PM` for 12h time.',
                            type: Constants.ApplicationCommandOptionTypes.STRING,
                            required: true,
                            min_length: 0,
                            max_length: 10,
                        },
                        {
                            name: 'end',
                            description: 'The local time to end your bedtime. Use `HH:MM` for 24h time and `HH:MM AM/PM` for 12h time.',
                            type: Constants.ApplicationCommandOptionTypes.STRING,
                            required: true,
                            min_length: 0,
                            max_length: 10,
                        },
                    ],
                }
            ]
        },
        {
            name: 'clear',
            description: 'Clear your time information.',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
            options: [
                {
                    name: 'timezone',
                    description: 'Clear your timezone.',
                    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                },
                {
                    name: 'bedtime',
                    description: 'Clear your bedtime.',
                    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
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