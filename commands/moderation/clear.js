const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Kanaldan toplu mesaj siler.')
        .addIntegerOption(o => o.setName('sayi').setDescription('Silinecek mesaj sayısı (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const count = interaction.options.getInteger('sayi');
        
        await interaction.channel.bulkDelete(count, true);
        await interaction.reply({ content: `🧹 Başarıyla **${count}** adet mesaj silindi.`, ephemeral: true });
    }
};