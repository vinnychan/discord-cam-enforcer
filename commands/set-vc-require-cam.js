const { PREFIX } = require('../config.json');
const UsageHelp = require('../util/usageHelp');
const Error = require('../util/error');

const name = 'set-vc-require-cam';
const usage = '<channelID> <true|false>';
const description = 'Set a voice channel to require video camera to be on. Kicks members that have camera off for more than the configured timeout';
const aliases = ['set-cam', 'svrc'];

const execute = (message, args) => {
        if (args.length !== 2 || (args[1] !== 'true' && args[1] !== 'false')) {
            return UsageHelp.send(message.channel, `${PREFIX}${name} ${usage}`);
        }
        // find channel
        const voiceChannel = message.guild.channels.cache.get(args[0]);
        if (!voiceChannel) {
            return Error.send(message.channel, 'Voice channel not found');
        }
        
        if (voiceChannel.type !== 'voice') {
            return Error.send(message.channel, `${args[0]} is not a voice channel`);
        }

        // set channel
        // await db.setCamRequire(channelID, args[1]);
        message.channel.send(`MOCK: set channel #${voiceChannel.name} to ${args[1]}`)
}

module.exports = {
	name,
    description,
    args: true,
    usage,
    aliases,
    execute
};