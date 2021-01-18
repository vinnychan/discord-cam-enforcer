const Keyv = require('keyv');
const kevy = new Keyv('redis://localhost:6379');

module.exports = {
    name: 'flush-db',
    description: 'Flush backend data',
    aliases: [],
    async execute(message) {
        await kevy.clear();
        message.channel.send('Cleared db!');
    },
};
