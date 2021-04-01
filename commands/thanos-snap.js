module.exports = {
    name: 'thanos-snap',
    description: 'Snap about half the members of the server',
    aliases: [],
    permissions: 'KICK_MEMBERS',
    execute(message, args) {
        const guildId = '789157083898707988'; // 852
        // const guildId = '521559737616039956'; // del me
        const snappedRole = message.guild.roles.cache.find(role => role.name === 'snapped');
        const guild = message.client.guilds.cache.get(guildId);
        if (args && args.length > 0) {
            if (args[0] === 'count') {
                guild.members.fetch().then(result => {
                    let count = 0;
                    result.forEach(member => {
                        if (member.roles.cache.has('827012278138175488')) {
                            count++;
                        }
                    });
                    message.channel.send(`Users snapped: ${count}/${result.size}`);
                });
                // const roleID = '827055431679606794'; // del role id
                // const roleID = '827012278138175488';
                // const membersWithRole = message.guild.roles.cache.get(roleID).members;
                // message.channel.send(`Users snapped: ${membersWithRole.size}`);
            }
        } else {
            guild.members.fetch().then(result => {
                result.forEach(member => {
                    if (Math.random() < 0.5) {
                        member.roles.add(snappedRole).catch(console.error);
                    }
                });
                message.channel.send('Mr. Stark... I don\'t feel so good');
            }).catch(err => {
                console.error(err);
            });
        }



    },
};
