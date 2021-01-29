const { Client, Message } = require('discord.js');
/**
 * This is a command
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 * @param {number} level
 */
exports.run = async (client, message, args, level) => {
    // Check if the user specifies valid backups
    let dbs = ['settings', 'internal', 'cards', 'games', 'crystals'];
    if(args[0])dbs = args.filter(a => dbs.find(d => d == a));
    if (!dbs[0]) return message.reply('Please choose at least one valid db.');

    const fs = require('fs').promises;
    try {
        await require('fs').promises.readdir('./backups');// ensure backups folder exists
    } catch (e) {
        return message.reply('Backups folder doesn\'t exist or something else went wrong.');
    }
    let suc = [];
    let err = [];
    for (let i = 0; i < dbs.length; i++) {
        let db = dbs[i];
        try {
            await client[db].import(await fs.readFile(`./backups/${db}.json`));
            suc.push(db);
        } catch (e) {
            err.push(db);
            console.error(`Error restoring: ${db}`);
            console.error(e);
        }
    }
    let m = `Successfully restored ${suc.length == 1 ? suc[0] : `all ${suc.length} db's`}`;
    if(err.length && !suc.length) m = `${err.length == 1 ? `All ${err.length}` : 'Your'} db${err.length == 1 ? 's' : ''} failed to restore.`;
    if(err.length && suc.length) m = `${err.length} db${err.length == 1 ? 's' : ''} failed to restore. They were ${'```'}\n${err.join('\n')}${'```'}`;
    message.reply(m);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 'Bot Admin',
    hidden: true
};

exports.help = {
    name: 'restore',
    category: 'System',
    description: 'It like... Pings. Then Pongs. And it\'s not Ping Pong.',
    usage: 'restore [dbs]'
};
