const name = 'set-vc-require-cam-timeout';
const usage = '<time in milliseconds>';
const description = 'Set timeout to turn on camera before user is kicked';
const aliases = ['set-timeout', 'svrct'];
const DB = require('../db/connections');

const globalDB = DB.getGlobalDbConnection();

const execute = async (message, args) => {
    const success = await globalDB.set('timeout', args[0]);
    if (success) {
        message.channel.send(`Set timeout to ${args[0]}`);
    } else {
        message.channel.send('Failed to set timeout');
    }
};

module.exports = {
    name,
    description,
    args: true,
    usage,
    aliases,
    execute,
};