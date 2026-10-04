const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Metin kanallarındaki susturmayı kaldırır.')
        .addUserOption(o => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const member = await interaction.guild.members.fetch(user.id);
        
        const muteRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
        if (muteRole) await member.roles.remove(muteRole);
        
        await interaction.reply(`🔊 **${user.tag}** kullanıcısının metin susturması kaldırıldı.`);
    }
};