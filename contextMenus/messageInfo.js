const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Message Info')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        const message = interaction.targetMessage;
        
        const embed = new EmbedBuilder()
            .setTitle('📄 Message Information')
            .setColor('#ff6b6b')
            .addFields(
                { name: '👤 Author', value: `${message.author.tag}`, inline: true },
                { name: '📅 Created', value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`, inline: true },
                { name: '🆔 Message ID', value: message.id, inline: true },
                { name: '📝 Content Length', value: `${message.content.length} characters`, inline: true },
                { name: '📎 Attachments', value: `${message.attachments.size}`, inline: true },
                { name: '⚡ Reactions', value: `${message.reactions.cache.size}`, inline: true }
            )
            .setFooter({ text: 'BeatBoxer Bot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        if (message.content) {
            embed.addFields({ name: '💬 Content Preview', value: message.content.length > 100 ? message.content.substring(0, 100) + '...' : message.content, inline: false });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
