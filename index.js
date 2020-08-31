// Throw error on outdated node
if (Number(process.version.slice(1).split(".")[0]) < 12)
  throw new Error(
    "Node 12.0.0 or higher is required. Update Node on your system."
  );

// Require all the things!
require('dotenv').config();
const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const Josh = require("josh");
const provider = require('@josh-providers/sqlite');
const fs = require("fs");
const express = require("express");

// Start express server
const app = express();
app.listen(process.env.PORT);
app.use(express.static(__dirname + "/views"));

// Make the client
const client = new Discord.Client();

// load stuffs
client.config = require("./config.js");

client.logger = require("./modules/Logger");

require("./modules/functions.js")(client);

// commands and stuff
client.commands = new Enmap();
client.aliases = new Enmap();

// db's
Object.assign(client, Enmap.multi(["settings", "internal"]));

client.cards = new Josh({
  name: "cards",
  provider
})

client.games = new Josh({
  name: "game",
  provider
})

client.crystals = new Josh({
  name: "crystals",
  provider
})


const init = async () => {
  // Load commands
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });
  // Load Events
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);

    client.on(eventName, event.bind(null, client));
  });
  // Level cache
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }
  // Login
  client.login(client.config.token);
};

init();
