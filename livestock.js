// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
  name: 'livestock',
  description: 'Display the service stock in real time',
  execute(message) {
    // Check if the user is an administrator
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      return message.channel.send("You don't have permission to use this command!");
    }
    // Arrays
    let stock = [];
    let embed;

    // Read all of the services
    fs.readdir(`${__dirname}/../stock/`, function (err, files) {
      // If cannot scan the directory
      if (err) return console.log('Unable to scan directory: ' + err);

      // Put services into the stock
      stock = [];
      files.forEach(function (file) {
        if (!file.endsWith('.txt')) return
        stock.push(file)
      });

      // Create the embed
      embed = new MessageEmbed()
        .setColor(config.color.default)
        .setTitle(`${message.guild.name} has **${stock.length} services**`)
        .setDescription('')

      // Push all services to the stock
      stock.forEach(async function (data) {
        const acc = fs.readFileSync(`${__dirname}/../stock/${data}`, 'utf-8')
        const lines = [];

        // Get number of lines
        acc.split(/\r?\n/).forEach(function (line) {
          lines.push(line); // Push to lines
        });

        // Update embed description message
        embed.description += `**${data.replace('.txt','')}:** \`${lines.length}\`\n`
      });

      // Send the stock to the channel
      message.channel.send(embed).then(sentEmbed => {
        // Set up a timer to update the stock every 60 seconds
        const updateInterval = setInterval(() => {
          // Read the new service file and update the stock
          fs.readdir(`${__dirname}/../stock/`, function (err, files) {
            // If cannot scan the directory
            if (err) return console.log('Unable to scan directory: ' + err);
        // Update the stock array with the new list of files
        stock = [];
        files.forEach(function (file) {
          if (!file.endsWith('.txt')) return
          stock.push(file)
        });

        // Update the stock in the embed
        embed.setDescription('');
        stock.forEach(async function (data) {
          const acc = fs.readFileSync(`${__dirname}/../stock/${data}`, 'utf-8')
          const lines = [];

          // Get number of lines
          acc.split(/\r?\n/).forEach(function (line) {
            lines.push(line); // Push to lines
          });

          // Check if any services have been added or removed
          const newServices = files.filter(file => !stock.includes(file));
          const removedServices = stock.filter(file => !files.includes(file));

// If any services have been added, update the embed
if (newServices.length > 0) {
newServices.forEach(async function (data) {
 const acc = fs.readFileSync(`${__dirname}/../stock/${data}`, 'utf-8')
const lines = [];
                          // Get number of lines
              acc.split(/\r?\n/).forEach(function (line) {
                lines.push(line); // Push to lines
              });

              // Update embed description message
              embed.description += `**${data.replace('.txt','')}:** \`${lines.length}\`\n`;
            });
          }

          // If any services have been removed, update the embed
          if (removedServices.length > 0) {
            removedServices.forEach(async function (data) {
              // Update embed description message
              embed.description = embed.description.replace(`**${data.replace('.txt','')}:** \`\d+\`\n`, '');
            });
          }

          // Update the stock in the embed
          stock.forEach(async function (data) {
            const acc = fs.readFileSync(`${__dirname}/../stock/${data}`, 'utf-8')
const lines = [];
                      // Get number of lines
            acc.split(/\r?\n/).forEach(function (line) {
              lines.push(line); // Push to lines
            });

            // Update embed description message
            let oldDescription = embed.description;
            let newDescription = oldDescription.replace(`**${data.replace('.txt','')}:** \`\d+\`\n`, `**${data.replace('.txt','')}:** \`${lines.length}\`\n`);
            embed.description = newDescription;
          });

          // Edit the message with the updated embed
          sentEmbed.edit(embed);
        });
      }, 60000); // 60000 milliseconds = 1 minute

      // Set up a message collector to stop the update timer when the message is deleted
      const filter = m => m.id === sentEmbed.id;
      const collector = message.channel.createMessageCollector(filter, {
        time: 60000
      });
      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          clearInterval(updateInterval);
        }
      });
    });
  });
});
}
};