const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('un-timeout')
        .setDescription('Kullanıcının susturmasını erken kaldırır.')
        .addUserOption(o => o.setName('kullanici').setDescription('Susturması kaldırılacak kullanıcı').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const member = await interaction.guild.members.fetch(user.id);
        
        await member.timeout(null);
        await interaction.reply(`🔊 **${user.tag}** adlı kullanıcının susturması kaldırıldı.`);
    }
};