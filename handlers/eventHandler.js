const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Load events
const loadEvents = async (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    
    // Create events directory if it doesn't exist
    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath, { recursive: true });
        console.log(chalk.blue('📁 Created events directory'));
    }
    
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    let loadedEvents = 0;
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        
        try {
            // Clear require cache to allow reloading
            delete require.cache[require.resolve(filePath)];
            const event = require(filePath);
            
            if (!event.name || !event.execute) {
                console.log(chalk.red(`❌ Event ${file} is missing required "name" or "execute" property.`));
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
            
            loadedEvents++;
            console.log(chalk.green(`✅ Loaded event: ${event.name} (${event.once ? 'once' : 'on'})`));
            
        } catch (error) {
            console.log(chalk.red(`❌ Error loading event ${file}: ${error.message}`));
        }
    }
    
    console.log(chalk.cyan(`🎉 Total events loaded: ${loadedEvents}`));
};

module.exports = {
    loadEvents
};
