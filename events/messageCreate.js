// const bedtime = async (message) => {
//     let data = await message.client.times.get(`${message.author.id}`);
//     if (!data) return;
//     let { offset, bedtime, lastAlert } = data;
//     if (isNaN(offset) || !Array.isArray(bedtime)) return;
//     if (Date.now() - lastAlert < 600000) return;
//     let date = new Date(Date.now() + (offset * 60 * 60 * 1000));
//     let time = date.getUTCHours() + date.getUTCMinutes() / 60;
//     let newAlert = Date.now();
//     if (!message.client.pastBedtime(...bedtime, time)) return;
//     message.author.send(`Hey ${message.author}, It's past your set bedtime (\`${message.client.getTime(time)}\`)! Make sure your getting enough sleep!`)
//         .catch(() =>
//             message.channel.send(`Hey ${message.author}, It's past your set bedtime (\`${message.client.getTime(time)}\`)! Make sure your getting enough sleep!`)
//                 .catch(() => { newAlert = lastAlert; })
//         );
//     message.client.times.set(`${message.author.id}.lastAlert`, newAlert);
// };

/**
 * @param {import('eris').Client} client 
 * @param {import('eris').Message} message
 */
module.exports = async (client, message) => {
    // Prevent botception 
    if (message.author.bot) return;
    // Tell people who need to go to sleep to go to sleep.
    // TODO: Make this work
    // bedtime(message);
};
