const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const loadCommands = async (client) => {
    const commandsPath = path.join(__dirname, '..', 'commands');

    if (!fs.existsSync(commandsPath)) {
        fs.mkdirSync(commandsPath, { recursive: true });
        console.log(chalk.blue('📁 Created commands directory'));
    }

    let loadedCommands = 0;

    const loadCommandsFromDirectory = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                loadCommandsFromDirectory(filePath);
            } else if (file.name.endsWith('.js')) {
                try {
                    const command = require(filePath);

                    if ('data' in command && 'execute' in command) {
                        client.commands.set(command.data.name, command);
                        loadedCommands++;

                        const relativePath = path.relative(commandsPath, filePath);
                        console.log(chalk.green(`✅ Loaded command: ${command.data.name} (${relativePath})`));
                    } else {
                        const relativePath = path.relative(commandsPath, filePath);
                        console.log(chalk.red(`❌ Command ${relativePath} is missing "data" or "execute"`));
                    }
                } catch (error) {
                    const relativePath = path.relative(commandsPath, filePath);
                    console.log(chalk.red(`❌ Error loading command ${relativePath}: ${error.message}`));
                }
            }
        }
    };

    loadCommandsFromDirectory(commandsPath);
    console.log(chalk.cyan(`📋 Total commands loaded: ${loadedCommands}`));
};

const loadContextMenus = async (client) => {
    const contextMenusPath = path.join(__dirname, '..', 'contextMenus');

    if (!fs.existsSync(contextMenusPath)) {
        fs.mkdirSync(contextMenusPath, { recursive: true });
        console.log(chalk.blue('📁 Created contextMenus directory'));
    }

    const contextMenuFiles = fs.readdirSync(contextMenusPath).filter(file => file.endsWith('.js'));

    let loadedContextMenus = 0;

    for (const file of contextMenuFiles) {
        const filePath = path.join(contextMenusPath, file);
        const contextMenu = require(filePath);

        if ('data' in contextMenu && 'execute' in contextMenu) {
            client.contextMenus.set(contextMenu.data.name, contextMenu);
            loadedContextMenus++;
            console.log(chalk.green(`✅ Loaded context menu: ${contextMenu.data.name}`));
        } else {
            console.log(chalk.red(`❌ Context menu ${file} is missing "data" or "execute"`));
        }
    }

    console.log(chalk.cyan(`📋 Total context menus loaded: ${loadedContextMenus}`));
};

const registerCommands = async (client) => {
    const globalCommands = [];
    const devCommands = [];

    client.commands.forEach(command => {
        if (command.devOnly) {
            devCommands.push(command.data.toJSON());
        } else {
            globalCommands.push(command.data.toJSON());
        }
    });

    client.contextMenus.forEach(contextMenu => {
        if (contextMenu.devOnly) {
            devCommands.push(contextMenu.data.toJSON());
        } else {
            globalCommands.push(contextMenu.data.toJSON());
        }
    });

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        if (devCommands.length > 0 && process.env.GUILD_ID) {
            console.log(chalk.yellow(`🧪 Registering ${devCommands.length} devOnly command(s) to guild ${process.env.GUILD_ID}`));
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: devCommands }
            );
            console.log(chalk.green(`✅ Dev commands registered to guild: ${devCommands.length}`));
        }

        if (globalCommands.length > 0) {
            console.log(chalk.yellow(`🌍 Registering ${globalCommands.length} global command(s)`));
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: globalCommands }
            );
            console.log(chalk.green(`✅ Global commands registered: ${globalCommands.length}`));
        }

        if (globalCommands.length === 0 && devCommands.length === 0) {
            console.log(chalk.red('⚠️ No commands to register.'));
        }
    } catch (error) {
        console.error(chalk.red('❌ Error registering commands:'), error);
    }
};

module.exports = {
    loadCommands,
    loadContextMenus,
    registerCommands
};
