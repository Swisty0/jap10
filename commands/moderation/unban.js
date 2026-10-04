const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Kullanıcının yasağını kaldırır.')
        .addStringOption(o => o.setName('id').setDescription('Kullanıcının ID numarası').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const userId = interaction.options.getString('id');
        
        await interaction.guild.members.unban(userId);
        await interaction.reply(`🔓 ID'si belirtilen kullanıcının yasağı başarıyla kaldırıldı.`);
    }
};