const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

client.login(config.BOT_TOKEN);

const prefix = "!";

const bannedWordsMap = new Map();

client.on("message", function(message) {
    if (message.author.bot) return;
    // if (!message.content.startsWith(prefix)) return;

    // const commandBody = message.content.slice(prefix.length);
    // const args = commandBody.split(' ');
    // const command = args.shift().toLowerCase();

    if (message.content === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);    
    }

    if (message.content === '屌') {
        let warnCount = 0;
        if (bannedWordsMap.has(message.member.id)) {
            warnCount = bannedWordsMap.get(message.member.id);
            warnCount++;
            bannedWordsMap.set(message.member.id, warnCount);
        } else {
            bannedWordsMap.set(message.member.id, 1);
        }
        warnCount = bannedWordsMap.get(message.member.id);
        message.reply(`dont do that, you have been warned ${warnCount} times`);
        if (warnCount >= 5) {
            const role = message.member.guild.roles.cache.find(role => role.name === "muted");
            message.member.roles.add(role);
        }
    }
});

client.on("voiceStateUpdate", (oldState, newState) => {
    if (newState.channel && newState.channel.name === 'General') {
        setTimeout(() => {
            if (!newState.member.voice.selfVideo) {
                newState.member.send("please have camera on when in auntie gossip");
                newState.member.voice.kick();
            }
        }, 5000);
    }
});