const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../steam_accounts.json');

function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        return { accounts: [], stats: { totalDistributed: 0 }, cooldowns: {} };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('steam-panel')
        .setDescription('Steam hesap dağıtım panelini kurar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const data = loadData();
        const stokSayisi = data.accounts.length;
        const dagitilanSayisi = data.stats.totalDistributed;

        const embed = new EmbedBuilder()
            .setColor('#0138a8')
            .setTitle(' <:emoji_32:1556397528055021599> Steam Hesap Dağıtım Paneli')
            .setDescription(' <a:strike:1556289237295431700> Ücretsiz Steam hesabı almak için aşağıdaki **Steam Hesap Al** butonuna tıklayabilirsin.\n\n> <a:hata:1556289141119918132> **Şartlar:**\n> <a:sagaok:1556302879512334356> Discord durumunda `discord.gg/jap10`, `gg/jap10` veya `/jap10` yazmalıdır.\n> <a:sagaok:1556302879512334356> Günde en fazla **2 adet** hesap alabilirsin (24 saatte bir yenilenir).')
            .addFields(
                { name: '<a:strike:1556289237295431700> Kategori', value: '`steam`', inline: true },
                { name: '<a:zoktay:1556289269109366856> Gerekli Durum', value: '`discord.gg/jap10`', inline: true },
                { name: '<a:partimuzik:1544076160445587576> İstatistikler', value: `Dağıtılan: **${dagitilanSayisi}** \vert{} Stok: **${stokSayisi}**`, inline: false }
            )
            .setFooter({ text: 'Jap10 Hesap • steam' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('get_steam_account')
                .setLabel('Steam Hesap Al')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🔑')
        );

        await interaction.reply({ content: 'Steam paneli başarıyla kuruluyor!', ephemeral: true });
        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};