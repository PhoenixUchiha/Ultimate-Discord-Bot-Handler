const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
const figlet = require('figlet');
const { loadCommands, loadContextMenus, registerCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const mongoHandler = require("./handlers/mongoDb");
require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = 'your-mongodb-uri-here';

// Console Banner
console.log(chalk.cyan(figlet.textSync('Starter Bot', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
})));

// Client Setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Command and Context Menu Collections
client.commands = new Collection();
client.contextMenus = new Collection();

// Load Handlers
const loadHandlers = async () => {
    console.log(chalk.yellow('📂 Loading handlers...'));
    await loadCommands(client);
    await loadEvents(client);
    await loadContextMenus(client);
    await registerCommands(client);
    await mongoHandler(mongoURI);
};

// Interaction Handler
client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(chalk.red(`❌ No command matching ${interaction.commandName} was found.`));
            return;
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(chalk.red('❌ Error executing command:'), error);
            const errorMessage = { content: 'There was an error while executing this command!', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    } else if (interaction.isContextMenuCommand()) {
        const contextMenu = client.contextMenus.get(interaction.commandName);
        if (!contextMenu) {
            console.error(chalk.red(`❌ No context menu matching ${interaction.commandName} was found.`));
            return;
        }
        try {
            await contextMenu.execute(interaction);
        } catch (error) {
            console.error(chalk.red('❌ Error executing context menu:'), error);
            const errorMessage = { content: 'There was an error while executing this context menu!', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
});

// Ready Event
client.once('ready', () => {
    const dbStatus = mongoose.connection.readyState === 1 ? '🟢 Connected' : '🔴 Disconnected';
    console.log(chalk.green(figlet.textSync('READY!', { font: 'Small' })));
    console.log(chalk.green(`🚀 Bot is online as ${client.user.tag}!`));
    console.log(chalk.cyan(`📊 Serving ${client.guilds.cache.size} guilds`));
    console.log(chalk.cyan(`👥 Watching ${client.users.cache.size} users`));
    console.log(chalk.blue(`📦 MongoDB Status: ${dbStatus}`));
    console.log(chalk.magenta('='.repeat(50)));
});

// Error Handling
process.on('unhandledRejection', error => {
    console.error(chalk.red('❌ Unhandled promise rejection:'), error);
});
process.on('uncaughtException', error => {
    console.error(chalk.red('❌ Uncaught exception:'), error);
    process.exit(1);
});

// Bot Init
const init = async () => {
    try {
        if (!process.env.TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
            console.error(chalk.red('❌ Missing required environment variables. Please check your .env file.'));
            console.log(chalk.yellow('Required variables: TOKEN, CLIENT_ID, GUILD_ID'));
            process.exit(1);
        }
        await loadHandlers();
        console.log(chalk.yellow('🔐 Logging in...'));
        await client.login(process.env.TOKEN);
    } catch (error) {
        console.error(chalk.red('❌ Failed to initialize bot:'), error);
        process.exit(1);
    }
};

init();
