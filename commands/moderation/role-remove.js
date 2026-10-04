const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-remove')
        .setDescription('Kullanıcıdan belirtilen rolü alır.')
        .addUserOption(o => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
        .addRoleOption(o => o.setName('rol').setDescription('Alınacak Rol').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const role = interaction.options.getRole('rol');
        const member = await interaction.guild.members.fetch(user.id);
        
        await member.roles.remove(role);
        await interaction.reply(`❌ **${user.tag}** adlı kullanıcıdan **${role.name}** rolü alındı.`);
    }
};