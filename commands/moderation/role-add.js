const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-add')
        .setDescription('Kullanıcıya belirtilen rolü verir.')
        .addUserOption(o => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
        .addRoleOption(o => o.setName('rol').setDescription('Verilecek Rol').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const role = interaction.options.getRole('rol');
        const member = await interaction.guild.members.fetch(user.id);
        
        await member.roles.add(role);
        await interaction.reply(`✅ **${user.tag}** adlı kullanıcıya **${role.name}** rolü verildi.`);
    }
};