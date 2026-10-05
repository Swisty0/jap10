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

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disney-panel')
        .setDescription('Disney Plus hesap dağıtım panelini kurar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Komut kullanıldığında paneli kur
        const data = loadData();
        const stokSayisi = data.accounts.length;
        const dagitilanSayisi = data.stats.totalDistributed;

        const embed = new EmbedBuilder()
            .setColor('#0138a8')
            .setTitle(' <:emoji_32:1556397528055021599> Disney Plus Hesap Dağıtım Paneli')
            .setDescription(' <a:strike:1556289237295431700> Ücretsiz Disney Plus hesabı almak için aşağıdaki **Disney Plus Hesap Al** butonuna tıklayabilirsin.\n\n> <a:hata:1556289141119918132> **Şartlar:**\n> <a:sagaok:1556302879512334356> Discord durumunda `discord.gg/jap10`, `gg/jap10` veya `/jap10` yazmalıdır.\n> <a:sagaok:1556302879512334356> Günde en fazla **2 adet** hesap alabilirsin (24 saatte bir yenilenir).')
            .addFields(
                { name: '<a:strike:1556289237295431700> Kategori', value: '`disney`', inline: true },
                { name: '<a:zoktay:1556289269109366856> Gerekli Durum', value: '`discord.gg/jap10`', inline: true },
                { name: '<a:partimuzik:1544076160445587576> İstatistikler', value: `Dağıtılan: **${dagitilanSayisi}** \vert{} Stok: **${stokSayisi}**`, inline: false }
            )
            .setFooter({ text: 'Jap10 Hesap • disney' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('get_disney_account')
                .setLabel('Disney Plus Hesap Al')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🔑')
        );

        await interaction.reply({ content: 'Disney Plus paneli başarıyla kuruluyor!', ephemeral: true });
        const panelMessage = await interaction.channel.send({ embeds: [embed], components: [row] });

        // Botun ana client üzerinden buton etkileşimlerini dinlemesi için collector başlatıyoruz
        const filter = i => i.customId === 'get_disney_account';
        const collector = panelMessage.createMessageComponentCollector({ filter });

        collector.on('collect, async i => {
            const userId = i.user.id;
            const currentData = loadData();

            // Stok kontrolü
            if (!currentData.accounts || currentData.accounts.length === 0) {
                return i.reply({ content: '❌ Üzgünüm, şu anda stokta hiç Disney Plus hesabı kalmadı!', ephemeral: true });
            }

            // Cooldown kontrolü (24 saat)
            if (currentData.cooldowns && currentData.cooldowns[userId]) {
                const lastTime = currentData.cooldowns[userId];
                const cooldownTime = 24 * 60 * 60 * 1000;
                if (Date.now() - lastTime < cooldownTime) {
                    const remainingHours = Math.ceil((cooldownTime - (Date.now() - lastTime)) / (1000 * 60 * 60));
                    return i.reply({ content: `⏳ Yeni bir hesap alabilmek için **${remainingHours} saat** daha beklemelisin.`, ephemeral: true });
                }
            }

            // Hesabı listeden çek ve stoktan düş
            const account = currentData.accounts.shift();
            currentData.stats.totalDistributed = (currentData.stats.totalDistributed || 0) + 1;
            
            if (!currentData.cooldowns) currentData.cooldowns = {};
            currentData.cooldowns[userId] = Date.now();

            saveData(currentData);

            // Kullanıcıya DM'den hesabı gönder
            try {
                await i.user.send(`🎉 İşte Disney Plus hesabın:\n\`${account}\`\n\nİyi seyirler dileriz!`);
                await i.reply({ content: '✅ Hesap başarıyla **özel mesaj (DM)** kutuna gönderildi!', ephemeral: true });
            } catch (error) {
                // Eğer DM'leri kapalıysa hesabı geri eklemesin ama kullanıcıya bildirsin
                await i.reply({ content: '⚠️ Özel mesajların (DM) kapalı olduğu için hesabı gönderemedim. Lütfen DM kutunu aç ve tekrar dene!', ephemeral: true });
            }
        });
    },
};
