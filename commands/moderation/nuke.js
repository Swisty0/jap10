const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Kanalı tamamen sıfırlar ve eski mesajları temizler.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const position = interaction.channel.position;
        const newChannel = await interaction.channel.clone({ position });
        
        await interaction.channel.delete();
        await newChannel.send(`💥 Kanal başarıyla sıfırlandı!`);
    }
};