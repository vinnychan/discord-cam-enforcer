const reminderCommand = require('./set-reminder-range');

module.exports = {
    name: 'clear-reminder-range',
    description: 'Removes the reminder range',
    aliases: [],
    execute(message) {
        reminderCommand.stopMsg();
        message.channel.send('Message reminder range removed');
    },
};
