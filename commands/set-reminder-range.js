const name = 'set-reminder-range';
const usage = '<msg> <[1-n]s>';
const description = 'Send message to channel within a random range';
const aliases = [];
// const DB = require('../db/connections');

// const globalDB = DB.getGlobalDbConnection();
// set the interval in the DB and fetch the interval each time
// so when we clear the interval, it can be set to null (or some other grave value) and will
// automatically clear the interval
let randomMsgInterval;
const execute = (message, args) => {
    message.channel.send(`Sending ${args[0]} every ${args[1]}s`);
    const sendMsg = () => {
        const interval = args[1].split('-');
        const min = parseInt(interval[0]);
        const max = parseInt(interval[1]);
        const rand = Math.floor(Math.random() * (max - min + 1) + min);
        message.channel.send(args[0]);
        randomMsgInterval = setTimeout(sendMsg, rand * 1000);
    };
    sendMsg();
};

const stopMsg = () => {
    if (randomMsgInterval) {
        clearTimeout(randomMsgInterval);
    }
};

module.exports = {
    name,
    description,
    args: true,
    permissions: 'KICK_MEMBERS',
    usage,
    aliases,
    execute,
    stopMsg,
};