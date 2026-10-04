const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice-kick')
        .setDescription('Kullanıcıyı bulunduğu ses kanalından atar.')
        .addUserOption(o => o.setName('kullanici').setDescription('Kullanıcı').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const member = await interaction.guild.members.fetch(user.id);
        
        await member.voice.disconnect();
        await interaction.reply(`🚪 **${user.tag}** ses kanalından çıkarıldı.`);
    }
};