const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../disney_accounts.json');

function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        return { accounts: [], stats: { totalDistributed: 0 }, cooldowns: {} };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disney-panel')
        .setDescription('Disney+ hesap dağıtım panelini kurar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const data = loadData();
        const stokSayisi = data.accounts.length;
        const dagitilanSayisi = data.stats.totalDistributed;

        const embed = new EmbedBuilder()
            .setColor('#113ccf') // Disney mavisi
            .setTitle('# 🎬 Disney+ Hesap Dağıtım Paneli')
            .setDescription('Ücretsiz Disney+ hesabı almak için aşağıdaki **Disney+ Hesap Al** butonuna tıklayabilirsin.\n\n> ⚠️ **Şartlar:**\n> • Discord durumunda `discord.gg/jap10`, `gg/jap10` veya `/jap10` yazmalıdır.\n> • Günde en fazla **2 adet** hesap alabilirsin (24 saatte bir yenilenir).')
            .addFields(
                { name: '📂 Kategori', value: '`disney`', inline: true },
                { name: '🎭 Gerekli Durum', value: '`discord.gg/jap10`', inline: true },
                { name: '📊 İstatistikler', value: `Dağıtılan: **${dagitilanSayisi}** \vert{} Stok: **${stokSayisi}**`, inline: false }
            )
            .setFooter({ text: 'Hesap Store • disney+' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('get_disney_account')
                .setLabel('Disney+ Hesap Al')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🎬')
        );

        await interaction.reply({ content: 'Disney+ paneli başarıyla kuruluyor!', ephemeral: true });
        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};
