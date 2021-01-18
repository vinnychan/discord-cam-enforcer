module.exports = {
    name: 'ping',
    description: 'Ping!',
    aliases: [],
    execute(message) {
        message.channel.send('Pong!');
    },
};
