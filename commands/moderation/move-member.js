const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move-member')
        .setDescription('Kullanıcıyı başka bir ses kanalına taşır.')
        .addUserOption(o => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
        .addChannelOption(o => o.setName('kanal').setDescription('Hedef Ses Kanalı').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const channel = interaction.options.getChannel('kanal');
        const member = await interaction.guild.members.fetch(user.id);
        
        await member.voice.setChannel(channel);
        await interaction.reply(`🔄 **${user.tag}** başarıyla taşındı.`);
    }
};