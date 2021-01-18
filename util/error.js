exports.send = (channel, description) => {
    const embedObject = {
        color: 0x990000,
        fields: [
            {
                name: 'Error',
                value: description,
            }
        ]
    }
    channel.send({embed: embedObject});
}

exports.sendCmdError = (channel, cmdName) => {
    this.send(channel, `Error trying to execute command: ${cmdName}`);
}