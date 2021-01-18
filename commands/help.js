const { PREFIX } = require('../config.json');
const UsageHelp = require('../util/usageHelp');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('List of commands:');
            data.push(commands.map(command => command.name).join('\n'));
            data.push(`\nYou can send \`${PREFIX}help [command name]\` to get info on a specific command!`);
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.reply('that\'s not a valid command!');
            }

            data.push(`**Name:** ${command.name}`);

            if (command.aliases && command.aliases.length) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
            if (command.usage) data.push(`**Usage:** ${PREFIX}${command.name} ${command.usage}`);
        }

        UsageHelp.send(message.channel, data);
    },
};