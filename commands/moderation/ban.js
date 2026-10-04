const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Kullanıcıyı sunucudan yasaklar.')
        .addUserOption(o => o.setName('kullanici').setDescription('Hedef kullanıcı').setRequired(true))
        .addStringOption(o => o.setName('sebep').setDescription('Yasaklama sebebi'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const reason = interaction.options.getString('sebep') ?? 'Sebep belirtilmedi';
        
        await interaction.guild.members.ban(user, { reason });
        await interaction.reply(`🔒 **${user.tag}** sunucudan yasaklandı. Sebep: \`${reason}\``);
    }
};