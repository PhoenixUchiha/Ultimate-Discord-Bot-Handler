const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(chalk.green(`🎉 ${client.user.tag} is now online and ready!`));
        console.log(chalk.blue(`📊 Connected to ${client.guilds.cache.size} guild(s)`));
        console.log(chalk.blue(`👤 Monitoring ${client.users.cache.size} user(s)`));
        
        // Set bot presence/activity
        client.user.setPresence({
            activities: [{ name: '🎵 BeatBoxer Vibes', type: 2 }], // Type 2 = Listening
            status: 'online',
        });
        
        console.log(chalk.magenta('🎵 Bot activity set to "Listening to BeatBoxer Vibes"'));
    },
};
