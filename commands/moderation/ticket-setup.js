const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Destek (Ticket) sistemini kurar ve buton gönderir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setDescription('# <a:AK47_left:1556287978857570315> JAP10 Destek Sistemi\n\n** <a:hata:1556289141119918132> Herhangi bir sorun, şikayet veya sorunuz varsa — aşağıdaki düğmeye basarak destek talebi oluşturun.**\n** <a:hata:1556289141119918132> Ekibimiz en kısa sürede sizinle iletişime geçecek.**\n** <a:hata:1556289141119918132> Probleminizi açık ve ayrıntılı şekilde açıklayın.**')
            .setColor('#c42525')
            .setImage('https://cdn.discordapp.com/banners/1551253200957480980/02d0bd6766f697df071b66da307e2dc4.webp?size=480')
            .setFooter({ text: 'JAP10 Guard Sistemi' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Ticket Aç')
                .setStyle(ButtonStyle.Success) // Yeşil renk için Success yapıldı
                .setEmoji('<:plus:1556289182526218332>')
        );

        await interaction.reply({ content: 'Destek mesajı başarıyla gönderiliyor!', ephemeral: true });
        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};