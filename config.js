const config = {
  ownerID: "517371142508380170",

  coOwner: "312974985876471810",

  admins: ["278157010233589764", "259066297109839872"],

  support: [],

  blocked: [],
  token: process.env.token,

  defaultSettings: {
    prefix: "-",
    modLogChannel: "mod-log",
    modRole: "Moderator",
    adminRole: "Administrator",
    systemNotice: "true", // This gives a notice when a user tries to run a command that they do not have permission to use.
    welcomeChannel: "welcome",
    welcomeMessage:
      "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
    welcomeEnabled: "false"
  },

  permLevels: [
    { level: 0, name: "User", check: () => true },
    {
      level: 5,
      name: "Moderator",
      check: message => {
        try {
          const modRole = message.guild.roles.cache.find(
            r => r.name.toLowerCase() === message.settings.modRole.toLowerCase()
          );
          if (modRole && message.member.roles.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    {
      level: 6,
      name: "Administrator",
      check: message => {
        try {
          const adminRole = message.guild.roles.cache.find(
            r =>
              r.name.toLowerCase() === message.settings.adminRole.toLowerCase()
          );
          return adminRole && message.member.roles.has(adminRole.id);
        } catch (e) {
          return false;
        }
      }
    },

    {
      level: 7,
      name: "Server Owner",
      check: message =>
        message.channel.type === "text"
          ? message.guild.ownerID === message.author.id
            ? true
            : false
          : false
    },

    {
      level: 8,
      name: "Bot Support",
      check: message => config.support.includes(message.author.id)
    },

    {
      level: 9,
      name: "Bot Admin",
      check: message => config.admins.includes(message.author.id)
    },

    {
      level: 10,
      name: "Co-Owner",
      check: message => message.client.config.coOwner === message.author.id
    },
    {
      level: 11,
      name: "Bot Owner",
      check: message => message.client.config.ownerID === message.author.id
    }
  ]
};

module.exports = config;
