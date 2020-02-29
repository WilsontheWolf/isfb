const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
  const embeds = [
    new Discord.RichEmbed()
      .setTitle("Tutorial")
      .setDescription(
        `Welcome ${message.author.username} to IIslands of War Save File Bot. The next couple of messages will show you how to use the bot.`
      )
      .setColor("RANDOM"),
    new Discord.RichEmbed()
      .setTitle("Saving Files")
      .setDescription(
        `Want to keep your messages stored for easy access? Just use the save command! 
To use the save command just do \`-save #\` and attach your save file. You can get your save file by following the steps for your OS:

**Windows:**
**Step 1:** press \`Win + R\`
**Step 2:** type \`%localappdata%\IIslandsOfWar\` in the box that pops up.

**Mac:**
Go to \`~/Library/Application Support/com.jwiggs.iislandsofwar\`

*Try using the* 💾 *reaction on a message with a file attached.*`
      )
      .setColor("RANDOM")
      .setImage(
        "https://cdn.discordapp.com/attachments/585935948379062273/585937090814935058/Save_Tutorial.gif"
      )
      .setFooter(
        `Note: Throughout this tutorial # will be used to represent a save slot. They will be a number from 1-5 and you can have 5 saved at a time.`
      ),
    new Discord.RichEmbed()
      .setTitle("Stats")
      .setDescription(
        `To view information about your iisland and get a picture use the \`-stats\` command. It can be used by attaching a file or using the # of a saved file.`
      )
      .setColor("RANDOM")
      .setImage(
        "https://cdn.discordapp.com/attachments/585935948379062273/585937719650418699/Stats_Tutorial.gif"
      ),
    new Discord.RichEmbed()
      .setTitle("Saves")
      .setDescription(
        `If you use the \`-saves\` command it will provide you info about the 5 saves you have to see what each one has in it.`
      )
      .setColor("RANDOM")
      .setImage(
        "https://cdn.discordapp.com/attachments/585935948379062273/585938478458601561/unknown.png"
      ),
    new Discord.RichEmbed()
      .setTitle("Update")
      .setDescription(
        `Did something turn out wrong on your file and you want the information refreshed. Use \`-update #\` it will regather the information from your save file.`
      )
      .setColor("RANDOM")
      .setImage(
        "https://cdn.discordapp.com/attachments/585935948379062273/585938675339362304/Update_Tutorial.gif"
      ),
    new Discord.RichEmbed()
      .setTitle("Modify")
      .setDescription(
        `Now lets say you want to change something in a save file. Using modify you can change information about your file. You can use a save slot or attach your file here.

**Usage:**
\`\`\`css
modify money (amount) (optional save #)
modify realm (amount) (optional save #) Note: not available on saves for test versions 5.1 and 5.2
modify lives (amount) (optional save #)
modify seed  (amount) (optional save #) Note: not available on saves that are under 5.1
modify blocks (name of block to change) (name of block to change to) (optional save #) WARNING: Changing blocks is likely to break things and need exact names.\`\`\``
      )
      .setColor("RANDOM")
      .setImage(
        "https://cdn.discordapp.com/attachments/585935948379062273/585966695710064660/Modify_Tutorial.gif"
      ),
    new Discord.RichEmbed()
      .setTitle("Download")
      .setDescription(
        `Now lets say you want to get your saved file out of the bot. You can get a copy using \`-download #\` and the bot will send a copy you can download.`
      )
      .setColor("RANDOM")
      .setImage(
        "https://cdn.discordapp.com/attachments/585935948379062273/585967489041563664/Download_Tutorial.gif"
      ),
    new Discord.RichEmbed()
      .setTitle("Delete")
      .setDescription(
        `So you've decided to remove the save from the bot **PERMANENTLY**.You can do so using \`-delete #\`. It will ask you for confirmation in which case if you want to delete your file say \`yes\`. Your file will now be gone D:`
      )
      .setColor("RED")
      .setImage(
        "https://cdn.discordapp.com/attachments/585935948379062273/585967910405799946/Delete_Tutorial.gif"
      ),
    new Discord.RichEmbed()
      .setTitle("Sharing")
      .setDescription(
        `You can share your files. After having a file saved use \`-share #\` to make it public.
If you want to send it to a certain person you can use the command \`-send # person\`. This will dm the user your save.`
      )
      .setColor("RANDOM")
      .setImage("http://www.agalil.com/image-files/thumbnail2.jpg"),
    new Discord.RichEmbed()
      .setTitle("Shared files")
      .setDescription(
        `If you want to access someone elses shared file or see which files they have that are public, use \`-saves user\` to see their public saves.
If you know what save of their's you want to get, use \`-download # user\` to get their save.

Note: Sharing is new and may have bugs.`
      )
      .setColor("RANDOM")
      .setImage("http://www.agalil.com/image-files/thumbnail2.jpg"),
    new Discord.RichEmbed()
      .setTitle("Closing Notes")
      .setDescription(
        `Now you know how to use the bot. If you ever need a reminder don't hesitate to run \`-tutorial\` again or use \`-help command\`. If you have feedback or find a bug feel free to contact <@517371142508380170>.`
      )
      .setColor("RANDOM")
  ];
  if (message.guild)
    message.channel.send(`Sending you a dm with the tutorial.📬`);
  embeds.forEach(async emb => {
    await message.author.send(emb);
  });
};
/*Template
new Discord.RichEmbed().setTitle('Title')
    .setDescription(`Description:`)
    .setColor('RANDOM')
    .setImage('http://www.agalil.com/image-files/thumbnail2.jpg'),
*/
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
  hidden: false
};

exports.help = {
  name: "tutorial",
  category: "Help",
  description: "Get a tutorial sent to you.",
  usage: "tutorial"
};
