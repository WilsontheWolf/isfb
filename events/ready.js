const { Constants } = require('@projectdysnomia/dysnomia');
const { initDbs } = require('../modules/dbs');
const { commands } = require('../modules/functions');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client 
 */
module.exports = async client => {
    console.log(
        `${client.user.username}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`
    );
    await initDbs();

    // Register commands
    console.log('Registering commands...');
    await client.bulkEditCommands(commands.filter(c => c.bot.enabled).map(c => c.slash))
        .then(() => console.log('Command registration successful!'))
        .catch(e => console.error('Error registering commands:', e));

    client.editStatus({
        name: 'for slash commands',
        type: Constants.ActivityTypes.WATCHING,
    });

};
