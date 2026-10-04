const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed-send')
        .setDescription('Kanala şık bir embed duyuru gönderir.')
        .addStringOption(o => o.setName('mesaj').setDescription('Duyuru içeriği').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const text = interaction.options.getString('mesaj');
        const embed = new EmbedBuilder()
            .setDescription(text)
            .setColor('Blue')
            .setTimestamp();
            
        await interaction.channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Embed başarıyla gönderildi.', ephemeral: true });
    }
};