const express = require("express");
module.exports = async client => {
  console.log(`Prepairing...`);
  client.settings.ensure("default", client.config.defaultSettings);
  client.user.setActivity(`Preparing...`, { type: "PLAYING" });
  client.logger.log(
    `${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`,
    "ready"
  );
  await client.generateIsland(client.readLocalFile());
  client.user.setActivity(`${client.config.defaultSettings.prefix}help`, {
    type: "PLAYING"
  });
};
