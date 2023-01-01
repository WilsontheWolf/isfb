const { handleBedtimeCheck } = require('../modules/time');

/**
 * @param {import('@projectdysnomia/dysnomia').Client} client 
 * @param {import('@projectdysnomia/dysnomia').Message} message
 */
module.exports = async (client, message) => {
    // Prevent botception 
    if (message.author.bot) return;
    
    await handleBedtimeCheck(message.channel, message.author);
};
