if (Number(process.version.slice(1).split(".")[0]) < 8)
  throw new Error(
    "Node 8.0.0 or higher is required. Update Node on your system."
  );

const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const fs = require("fs");
const express = require("express");
const app = express();
app.listen(process.env.PORT);
app.use(express.static(__dirname + "/views"));

const client = new Discord.Client();

client.config = require("./config.js");

client.logger = require("./modules/Logger");

require("./modules/functions.js")(client);

client.commands = new Enmap();
client.aliases = new Enmap();
client.ids = new Enmap();

client.settings = new Enmap({ name: "settings" });
client.saves = new Enmap({ name: "saves" });
client.cooldowns = new Enmap({ name: "cooldowns"});
client.reminders = new Enmap({ name: "reminders" });
client.cards = new Enmap({name: 'cards'});
client.game = new Enmap({name: 'deck'});


const init = async () => {
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);

    client.on(eventName, event.bind(null, client));
  });

  const idFiles = await readdir("./ids/");
  client.logger.log(`Loading a total of ${idFiles.length} item version ids.`);
  idFiles.forEach(f => {
    if (!f.endsWith(".json")) return;
    let name = f.split('.')
    name.pop()
    client.ids.set(name.join('.'), require(`./ids/${f}`))
  });
  
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();
