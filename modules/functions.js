const fs = require('fs');
const ini = require('ini');
const unirest = require('unirest');
const moment = require('moment');
const Jimp = require('jimp');
const Discord = require('discord.js');
const cache = {};
module.exports = client => {
    client.smartRead = async (search, message) => {
        let num = parseInt(search);
        let output;
        if (num && num > 0 && num < 6)
            return [
                await client.saves.get(message.author.id, `saves.${num}.save`),
                await client.saves.get(message.author.id, `saves.${num}`),
                num
            ];
        else return [await client.readInternetFile(search), undefined, undefined];
    };
    client.fetchUser = async (search, msg) => {
        const mention = new RegExp(/<@!?\d+>/g);
        const beg = new RegExp(/<@!?/g);
        let user;
        if (search.match(mention)) {
            user = search.match(mention)[0];
            user = user.slice(search.match(beg)[0].length, user.length - 1);
            return await client.users.cache.get(user);
        } else if (!msg.guild) {
            if (
                client.users.cache
                    .filter(user =>
                        user.username.toLowerCase().startsWith(search.toLowerCase())
                    )
                    .first()
            ) {
                let users = client.users.cache
                    .filter(user =>
                        user.username.toLowerCase().startsWith(search.toLowerCase())
                    )
                    .array();
                if (users.length == 1) return users[0];
                let question = '';
                console.log(users.length);
                for (var i = 0; i != users.length && i != 10; i++) {
                    question =
            question +
            `[${i + 1}] ${users[i].tag}
`;
                }
                let num = await client.awaitReply(
                    msg,
                    `Please choose one of these:
${question}`
                );
                return users[parseInt(num) - 1];
            }
        } else if (
            msg.guild.members.cache
                .filter(user =>
                    user.displayName.toLowerCase().startsWith(search.toLowerCase())
                )
                .first()
        ) {
            let users = msg.guild.members.cache
                .filter(user =>
                    user.displayName.toLowerCase().startsWith(search.toLowerCase())
                )
                .array();
            if (users.length == 1) return users[0].user;
            let question = '';
            console.log(users.length);
            for (var i = 0; i != users.length && i != 10; i++) {
                question =
          question +
          `[${i + 1}] ${users[i].displayName} (${users[i].user.tag})
`;
            }
            let num = await client.awaitReply(
                msg,
                `Please choose one of these:
${question}`
            );
            return users[parseInt(num) - 1].user;
        } else return client.users.cache.get(search);
    };
    client.Rnd = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    };
    client.generateIsland = async save => {
        let island = client.parse_island(save);
        let canvas = new Jimp(192, 192, 0x00000000);
        const promises = [];
        let time = 0;
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
                if (island.block[i][j]) {
                    let name;
                    if (parseFloat(save.exists.version) >= 6.2)
                        name = island.block[i][j].split('|')[1];
                    else name = island.block[i][j].split('|')[0];
                    if (!name) return;
                    try {
                        if (!cache[name])
                            cache[name] = await Jimp.read(
                                client.asset(name, parseFloat(save.exists.version))
                            );
                        canvas.composite(cache[name], i * 16, j * 16);
                    } catch (e) {
                        console.log(`Can't load image: ${name}`);
                    }
                }
                if (island.attachment[i][j]) {
                    let name;
                    if (parseFloat(save.exists.version) >= 6.2)
                        name = island.attachment[i][j].split('|')[1];
                    else name = island.attachment[i][j].split('|')[0];
                    if (!name) return;
                    try {
                        if (!cache[name])
                            cache[name] = await Jimp.read(
                                client.asset(name, parseFloat(save.exists.version))
                            );
                        canvas.composite(cache[name], i * 16, j * 16);
                    } catch (e) {
                        console.log(`Can't load image: ${name}`);
                    }
                }
            }
        }
        await canvas.scale(2, Jimp.RESIZE_NEAREST_NEIGHBOR);
        let image = new Discord.Attachment(
            await canvas.getBufferAsync(Jimp.MIME_PNG),
            'IIsland.png'
        );
        return image;
    };
    client.writeFile = async content => {
        return new Buffer(content, 'utf-8');
    };
    client.writeFileSlot = async (content, slot, message) => {
        client.saves.set(message.author.id, content, `saves.${slot}.save`);
    };
    client.writeIslandImageSlot = async (content, slot, message) => {
        let image = await client.generateIsland(content);
        let imageMsg = await client.channels
            .get('585121990541574155')
            .send(`Image for \`${message.author.tag}\` save slot ${slot}.`, image);
        client.saves.set(
            message.author.id,
            imageMsg.attachments.first().url,
            `saves.${slot}.image`
        );
    };
    client.sendFile = async (content, msg, name = 'save_5.txt') => {
        let object = await client.saveFile(content);
        let file = new Discord.Attachment(await client.writeFile(object), name);
        await msg.reply(file);
    };
    client.readLocalFile = (file = './readyiisland.ini') => {
        let result = fs.readFileSync(file, 'utf-8');
        return client.readFile(result);
    };
    client.readInternetFile = async url => {
        let result = await unirest.get(url);
        if (result.error) return undefined;
        if (result) return client.readFile(result.body);
        else return undefined;
    };
    client.readFile = file => {
        let result = ini.parse(file);
        return result;
    };
    client.saveFile = object => {
        let result = ini.stringify(object);
        return result;
    };

    client.asset = (name, v) => {
        if (v > 6.1) name = client.ids.get(v.toString(), name);
        if (name == 'tree_bush') name = '_tree_bush_' + client.Rnd(0, 3);
        if (name == 'tree_oak') name = '_tree_oak_' + client.Rnd(0, 3);
        if (name == 'tree_palm') name = '_tree_palm_' + client.Rnd(0, 3);
        if (name == 'tree_spruce') name = '_tree_spruce_' + client.Rnd(0, 3);
        if (name == 'tree_christmas') name = 'tree_christmas_' + client.Rnd(0, 3);
        if (name == 'snowman') name = 'snowman_' + client.Rnd(0, 3);
        if (name == 'farm') name = 'farm_' + client.Rnd(0, 3);
        if (name == 'house') name = 'house_' + client.Rnd(0, 5);
        if (name == 'shop') name = 'shop_' + client.Rnd(0, 3);
        if (name == 'windmill') name = 'windmill_' + client.Rnd(0, 9);
        return (
            'https://cdn.glitch.com/7eb7f1a0-e3d7-403c-a0b9-c7a513975734%2F_' +
      name +
      '.png?' +
      client.Rnd(0, 1234567876)
        );
    };
    client.parse_island = (file, object = true) => {
        try {
            let parsed_save = {
                block: [],
                attachment: [],
                keybind: []
            };
            let save_file;
            if (!object) save_file = client.readFile(file);
            else save_file = file;
            let buffer = save_file.island.island.split(' ');
            let bufferCount = 0;
            parsed_save.coreX = buffer[bufferCount];
            bufferCount++;
            parsed_save.coreY = buffer[bufferCount];
            bufferCount++;
            parsed_save.islandWidth = buffer[bufferCount];
            bufferCount++;
            parsed_save.islandHeight = buffer[bufferCount];
            bufferCount++;
            parsed_save.islandOffsetX = buffer[bufferCount];
            bufferCount++;
            parsed_save.islandOffsetY = buffer[bufferCount];
            bufferCount++;
            for (let i = 0; i < 12; i++) {
                parsed_save.block[i] = [];
                parsed_save.attachment[i] = [];
                parsed_save.keybind[i] = [];
                for (let j = 0; j < 12; j++) {
                    if (buffer[bufferCount] !== '_') {
                        parsed_save.block[i][j] = buffer[bufferCount];
                    }
                    bufferCount++;
                    if (buffer[bufferCount] !== '_') {
                        parsed_save.attachment[i][j] = buffer[bufferCount];
                    }
                    bufferCount++;
                    if (buffer[bufferCount] !== '_') {
                        parsed_save.keybind[i][j] = buffer[bufferCount];
                    }
                    bufferCount++;
                }
            }
            return parsed_save;
        } catch (e) {
            console.error(e);
        }
    };
    client.reverse_island = par => {
        try {
            let rev =
        par.coreX +
        ' ' +
        par.coreY +
        ' ' +
        par.islandWidth +
        ' ' +
        par.islandHeight +
        ' ' +
        par.islandOffsetX +
        ' ' +
        par.islandOffsetY;
            for (let i = 0; i < 12; i++) {
                for (let j = 0; j < 12; j++) {
                    rev =
            rev +
            ' ' +
            (par.block[i][j] ? par.block[i][j] : '_') +
            ' ' +
            (par.attachment[i][j] ? par.attachment[i][j] : '_') +
            ' ' +
            (par.keybind[i][j] ? par.keybind[i][j] : '_');
                }
            }
            return rev;
        } catch (e) {
            console.error(e);
        }
    };
    client.permlevel = message => {
        let permlvl = 0;
        const permOrder = client.config.permLevels
            .slice(0)
            .sort((p, c) => (p.level < c.level ? 1 : -1));
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (message.guild && currentLevel.guildOnly) continue;
            if (currentLevel.check(message)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    };
    client.getSettings = guild => {
        if (!guild) return client.settings.get('default');
        const guildConf = client.settings.get(guild.id) || {};
        // This "..." thing is the "Spread Operator". It's awesome!
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
        return { ...client.settings.get('default'), ...guildConf };
    };
    client.writeSettings = (id, newSettings) => {
        const defaults = client.settings.get('default');
        let settings = client.settings.get(id) || {};
        // Using the spread operator again, and lodash's "pickby" function to remove any key
        // from the settings that aren't in the defaults (meaning, they don't belong there)
        client.settings.set(id, {
            ..._.pickBy(settings, (v, k) => !_.isNil(defaults[k])),
            ..._.pickBy(newSettings, (v, k) => !_.isNil(defaults[k]))
        });
    };
    client.awaitReply = async (msg, question, limit = 60000) => {
        const filter = m => m.author.id === msg.author.id;
        await msg.channel.send(question);
        try {
            const collected = await msg.channel.awaitMessages(filter, {
                max: 1,
                time: limit,
                errors: ['time']
            });
            return collected.first().content;
        } catch (e) {
            return false;
        }
    };
    Object.defineProperty(String.prototype, 'toProperCase', {
        value: function () {
            return this.replace(
                /([^\W_]+[^\s-]*) */g,
                txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        }
    });
    client.clean = async (client, text) => {
        if (text && text.constructor.name == 'Promise') text = await text;
        if (typeof evaled !== 'string')
            text = require('util').inspect(text, { depth: 1 });
        text = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(
                client.token,
                'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YG9PH--4U--tG0'
            );
        return text;
    };
    client.loadCommand = commandName => {
        try {
            client.logger.log(`Loading Command: ${commandName}`);
            const props = require(`../commands/${commandName}`);
            if (props.init) {
                props.init(client);
            }
            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    };
    client.unloadCommand = async commandName => {
        let command;
        if (client.commands.has(commandName)) {
            command = client.commands.get(commandName);
        } else if (client.aliases.has(commandName)) {
            command = client.commands.get(client.aliases.get(commandName));
        }
        if (!command)
            return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;
        if (command.shutdown) {
            await command.shutdown(client);
        }
        const mod = require.cache[require.resolve(`../commands/${commandName}`)];
        delete require.cache[require.resolve(`../commands/${commandName}.js`)];
        for (let i = 0; i < mod.parent.children.length; i++) {
            if (mod.parent.children[i] === mod) {
                mod.parent.children.splice(i, 1);
                break;
            }
        }
        return false;
    };
    Object.defineProperty(Array.prototype, 'random', {
        value: function () {
            return this[Math.floor(Math.random() * this.length)];
        }
    });
    // `await client.wait(1000);` to "pause" for 1 second.
    client.wait = require('util').promisify(setTimeout);
    process.on('uncaughtException', err => {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
        client.logger.error(`Uncaught Exception: ${errorMsg}`);
        console.error(err);
        process.exit(1);
    });
    process.on('unhandledRejection', err => {
        client.logger.error(`Unhandled rejection: ${err}`);
        console.error(err);
    });
    client.getFaction = (u) => {
        let m;
        if (u.guild && u.guild.id == '501043184361537547') m = u;
        else m = client.guilds.get('501043184361537547').members.get(u.id);
        if(!m) return;
        if(m.id == '259066297109839872') return 'Jwiggs';
        if(m.roles.has('675944407744249885')) return 'Nova';
        if(m.roles.has('675944306917376000')) return 'Prime';
        if(m.roles.has('675944354547892264')) return 'Strike';
        if(['406538226258411524', '405816250866860032'].includes(m.id)) return 'Alt';
        return; 
    };
};
