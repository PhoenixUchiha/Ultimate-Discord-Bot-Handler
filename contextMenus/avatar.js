const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Get Avatar')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const user = interaction.targetUser;
        
        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("White")
            .setFooter({ text: 'BeatBoxer Bot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 5,
                    label: 'Download Avatar',
                    url: user.displayAvatarURL({ dynamic: true, size: 1024 })
                }]
            }]
        });
    },
};
