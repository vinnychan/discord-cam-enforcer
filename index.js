const fs = require('fs');
const Discord = require('discord.js');
const { BOT_TOKEN, PREFIX } = require('./config.json');
const UsageHelp = require('./util/usageHelp');
const Error = require('./util/error');
const Winston = require('winston');

const logger = Winston.createLogger({
	transports: [
		new Winston.transports.Console(),
		// new Winston.transports.File({ filename: 'log' }), // writes to file
	],
	format: Winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const bannedWordsMap = new Map();
const camRequiredMap = new Map();

function sendCmdError(channel, cmd) {
    const embedObject = {
        color: 0x990000,
        fields: [
            {
                name: 'Error',
                value: `Error trying to execute command: ${cmd}`,
            }
        ]
    }
    channel.send({embed: embedObject});
}

client.on('message', function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const commandBody = message.content.slice(PREFIX.length);
    const args = commandBody.trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply = `${PREFIX}${command.name} ${command.usage}`;
		}
		return UsageHelp.send(message.channel, reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        logger.log('error', error);
        Error.sendCmdError(message.channel, command.name);
    }

    if (message.content === '屌') {
        let warnCount = 0;
        if (bannedWordsMap.has(message.member.id)) {
            warnCount = bannedWordsMap.get(message.member.id);
            warnCount++;
            bannedWordsMap.set(message.member.id, warnCount);
        } else {
            bannedWordsMap.set(message.member.id, 1);
        }
        warnCount = bannedWordsMap.get(message.member.id);
        message.reply(`dont do that, you have been warned ${warnCount} times`);
        if (warnCount >= 5) {
            const role = message.member.guild.roles.cache.find(role => role.name === 'muted');
            message.member.roles.add(role);
        }
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.channel && newState.channel.name === 'General') {
        setTimeout(async () => {
            if (newState.member.voice.channelID && !newState.member.voice.selfVideo) {
                // check if member is still connected to voice before dm'ing
                try {
                    await newState.member.voice.kick();
                    newState.member.send('please have camera on when in auntie gossip');
                } catch (error) {
                    console.error(`Unable to kick user: ${newState.member}`)
                }
            }
        }, 5000);
    }
});

client.on('ready', () => logger.log('info', 'The bot is online!'));
client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));

process.on('uncaughtException', error => logger.log('error', error));

client.login(BOT_TOKEN);