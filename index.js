const fs = require('fs');
const Discord = require('discord.js');
const { BOT_TOKEN, PREFIX, DEFAULT_CAM_TIMEOUT } = require('./config.json');
const UsageHelp = require('./util/usageHelp');
const Error = require('./util/error');
const Winston = require('winston');
const DB = require('./db/connections');

const logger = Winston.createLogger({
    transports: [
        new Winston.transports.Console(),
        // new Winston.transports.File({ filename: 'log' }), // writes to file
    ],
    format: Winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

// init DBs
DB.init();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
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
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.channel && newState.channel.name === 'General') {
        // check if it is cam required channel
        const reqCamChannels = DB.getCamRequiredDbConnection();
        const globalDbConn = DB.getGlobalDbConnection();
        const camTimeout = globalDbConn.get('timeout');
        const camRequired = await reqCamChannels.get(newState.channel.id);
        if (camRequired) {
            setTimeout(async () => {
                if (newState.member.voice.channelID && !newState.member.voice.selfVideo) {
                    // check if member is still connected to voice before dm'ing
                    try {
                        await newState.member.voice.kick();
                        newState.member.send('please have camera on when in auntie gossip');
                    } catch (error) {
                        logger.log('error', `Unable to kick user: ${newState.member}`);
                    }
                }
            }, camTimeout || DEFAULT_CAM_TIMEOUT);
        }
    }
});

client.on('ready', () => logger.log('info', 'The bot is online!'));
client.on('debug', m => logger.log('debug', m));
client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));

process.on('uncaughtException', error => logger.log('error', error));

client.login(BOT_TOKEN);