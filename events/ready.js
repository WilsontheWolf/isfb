const { initDbs } = require('../modules/dbs');

/**
 * @param {import('eris').Client} client 
 */
module.exports = async client => {


    console.log(
        `${client.user.username}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`
    );    
    await initDbs();
    // client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {
    //     type: 'PLAYING'
    // });

};
