const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-mute')
        .setDescription('Kullanıcıyı ses kanalında susturur.')
        .addUserOption(o => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const member = await interaction.guild.members.fetch(user.id);
        
        await member.voice.setMute(true);
        await interaction.reply(`🎤🔇 **${user.tag}** ses kanalında susturuldu.`);
    }
};