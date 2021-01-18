exports.send = (channel, message) => {
    const embedObject = {
        color: 0xe0b90f,
        fields: [
            {
                name: 'Usage Help',
                value: message,
            }
        ]
    }
    channel.send({embed: embedObject});
}