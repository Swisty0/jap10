const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Metin kanallarında kullanıcıyı susturur.')
        .addUserOption(o => o.setName('kullanici').setDescription('Susturulacak kullanıcı').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const member = await interaction.guild.members.fetch(user.id);
        
        let muteRole = interaction.guild.roles.cache.find(r => r.name === 'Muted');
        if (!muteRole) {
            muteRole = await interaction.guild.roles.create({ name: 'Muted', permissions: [] });
            interaction.guild.channels.cache.forEach(c => c.permissionOverwrites.edit(muteRole, { SendMessages: false }));
        }
        
        await member.roles.add(muteRole);
        await interaction.reply(`🔇 **${user.tag}** metin kanallarından susturuldu.`);
    }
};