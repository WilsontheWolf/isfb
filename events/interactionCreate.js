const { Constants } = require('@projectdysnomia/dysnomia');
const config = require('../config');
const { commands, components, isPrivileged } = require('../modules/functions');
const { handleBedtimeCheck } = require('../modules/time');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client 
 * @param {import('@projectdysnomia/dysnomia').AnyInteractionGateway} interaction
 */
module.exports = async (client, interaction) => {
    if(interaction.type === Constants.InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE) return; // No support for autocomplete yet (no responding)
    if (config.blocked.includes(interaction.user?.id)) return interaction.createMessage({ content: "**Uh oh!** You've been blocked from using commands!", flags: Constants.MessageFlags.EPHEMERAL });
    const name = interaction.data.name || interaction.data.custom_id?.split('.')[0];
    const cmd = commands.get(name + interaction.data.type) || components.get(name + interaction.type);
    if (!cmd || !cmd.bot?.enabled || !cmd.run) return interaction.createMessage({ content: '**Uh oh!** An error occurred!', flags: Constants.MessageFlags.EPHEMERAL });
    if (cmd.bot.privileged)
        if (isPrivileged(interaction.user.id)) return interaction.createMessage({ content: "You don't have permission to run this command!", flags: Constants.MessageFlags.EPHEMERAL });

    try {
        console.info('User', interaction.user?.username, `ran ${cmd.bot.privileged ? 'privileged ' : ''}command`, interaction.data.name);
        await cmd.run(client, interaction);
    } catch (e) {
        console.error('Error running cmd', interaction.data.name, e);
        const msg = {
            content: `An error occurred running that command!\`\`\`${e}\`\`\``,
            flags: Constants.MessageFlags.EPHEMERAL,
        };
        if (interaction.acknowledged) {
            return interaction.createFollowup(msg).catch(e => console.error('Error following up error!', e));
        } else
            return interaction.createMessage(msg).catch(e => console.error('Error sending error!', e));
    }
    await handleBedtimeCheck(interaction.channel, interaction.user, interaction.locale);
};