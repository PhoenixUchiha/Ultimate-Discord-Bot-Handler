const chalk = require('chalk');

module.exports = {
    name: 'guildCreate',
    once: false,
    execute(guild) {
        console.log(chalk.green(`✅ Joined new guild: ${guild.name} (ID: ${guild.id})`));
        console.log(chalk.cyan(`👥 Guild has ${guild.memberCount} members`));
        
        // Try to send a welcome message to the system channel
        if (guild.systemChannel) {
            guild.systemChannel.send({
                content: `🎵 **Hello ${guild.name}!**\n\nThanks for adding BeatBoxer Bot! Use \`/ping\` to test me out.\n\nFor help and commands, feel free to explore the slash commands available!`
            }).catch(error => {
                console.log(chalk.yellow('⚠️ Could not send welcome message to system channel'));
            });
        }
    },
};
