const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Bot aracılığıyla kanala mesaj yazdırır.')
        .addStringOption(o => o.setName('mesaj').setDescription('Yazılacak metin').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const text = interaction.options.getString('mesaj');
        
        // 1. Önce Discord'a gizli bir yanıt vererek etkileşimi güvenceye alıyoruz (Zaman aşımını önler)
        await interaction.reply({ content: 'Mesaj iletildi.', ephemeral: true });

        // 2. Ardından istenen mesajı kanala gönderiyoruz
        await interaction.channel.send(text);
    }
};
