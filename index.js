require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
    ]
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
}

client.once('ready', () => {
    console.log(`Bot başarıyla giriş yaptı: ${client.user.tag}`);
    console.log(`Toplam ${client.commands.size} komut aktif olarak yüklendi!`);

    try {
        const voicePanel = require('./commands/moderation/voicePanel'); 
        voicePanel.execute(client);
        console.log('[VoicePanel] Modülü başarıyla yüklendi ve aktif!');
    } catch (err) {
        console.error('[VoicePanel] Yüklenirken hata oluştu:', err.message);
    }
});

const steamDataFile = path.join(__dirname, 'steam_accounts.json');

function loadSteamData() {
    if (!fs.existsSync(steamDataFile)) return { accounts: [], stats: { totalDistributed: 0 }, cooldowns: {} };
    return JSON.parse(fs.readFileSync(steamDataFile, 'utf8'));
}

function saveSteamData(data) {
    fs.writeFileSync(steamDataFile, JSON.stringify(data, null, 2));
}

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Bu komut çalıştırılırken bir hata oluştu!', ephemeral: true });
        }
        return;
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'create_ticket') {
            const guild = interaction.guild;
            const userName = interaction.user.username;
            const channelName = `ticket-${userName}`.toLowerCase().replace(/[^a-z0-9]/g, '');

            const ticketChannel = await guild.channels.create({
                name: channelName,
                type: 0, 
                permissionOverwrites: [
                    { id: guild.id, deny: ['ViewChannel'] },
                    { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
                ],
            });

            const embed = new EmbedBuilder()
                .setTitle(`Destek Talebi: ${userName}`)
                .setDescription('Yetkililer en kısa sürede sizinle ilgilenecektir.\nTalebi kapatmak için aşağıdaki butona tıklayabilirsiniz.')
                .setColor('#00FF00');

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Talebi Kapat')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

            await ticketChannel.send({ content: `<@${interaction.user.id}> destek talebin oluşturuldu!`, embeds: [embed], components: [row] });
            await interaction.reply({ content: `Destek kanalın oluşturuldu: ${ticketChannel}`, ephemeral: true });
        }

        if (interaction.customId === 'close_ticket') {
            await interaction.reply({ content: 'Destek talebi 5 saniye içinde kapatılıyor...' });
            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                } catch (err) {
                    console.error('Kanal silinirken hata oluştu:', err);
                }
            }, 5000);
        }

        if (interaction.customId === 'get_steam_account') {
            await interaction.deferReply({ ephemeral: true });

            const member = interaction.member;
            const targetRoleName = "Free"; 
            let role = interaction.guild.roles.cache.find(r => r.name === targetRoleName);

            let hasValidStatus = false;
            const activities = member.presence?.activities || [];
            for (const activity of activities) {
                const stateText = activity.state ? activity.state.toLowerCase() : "";
                if (
                    stateText.includes('discord.gg/jap10') || 
                    stateText.includes('gg/jap10') || 
                    stateText.includes('/jap10')
                ) {
                    hasValidStatus = true;
                    break;
                }
            }

            if (!hasValidStatus) {
                return interaction.editReply({ 
                    content: '❌ **Hata:** Discord durumunda (Custom Status) **`discord.gg/jap10`**, **`gg/jap10`** veya **`/jap10`** yazması gerekiyor! Lütfen durumunu güncelleyip tekrar dene.' 
                });
            }

            if (role && !member.roles.cache.has(role.id)) {
                try {
                    await member.roles.add(role);
                } catch (err) {
                    console.error("Rol verme hatası:", err);
                }
            }

            const data = loadSteamData();
            const userId = interaction.user.id;
            const now = Date.now();

            if (!data.cooldowns) data.cooldowns = {};
            if (!data.cooldowns[userId]) data.cooldowns[userId] = [];

            const dayInMillis = 24 * 60 * 60 * 1000;
            data.cooldowns[userId] = data.cooldowns[userId].filter(timestamp => now - timestamp < dayInMillis);

            if (data.cooldowns[userId].length >= 2) {
                const oldestUsage = data.cooldowns[userId][0];
                const timeLeft = Math.ceil((dayInMillis - (now - oldestUsage)) / (1000 * 60 * 60));
                return interaction.editReply({ content: `⏳ Günlük sınırına ulaştın! Yeni bir hesap alabilmek için **${timeLeft} saat** beklemelisin.` });
            }

            if (data.accounts.length === 0) {
                return interaction.editReply({ content: '❌ Şu anda sistemde hiç Steam hesabı stoğu kalmadı. Lütfen daha sonra tekrar dene.' });
            }

            const account = data.accounts.shift(); 
            data.cooldowns[userId].push(now);
            data.stats.totalDistributed = (data.stats.totalDistributed || 0) + 1;
            saveSteamData(data);

            // Panel mesajındaki istatistikleri anlık olarak güncelle
            try {
                const stokSayisi = data.accounts.length;
                const dagitilanSayisi = data.stats.totalDistributed;

                const updatedEmbed = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setTitle('# 🔑 Steam Hesap Dağıtım Paneli')
                    .setDescription('Ücretsiz Steam hesabı almak için aşağıdaki **Steam Hesap Al** butonuna tıklayabilirsin.\n\n> ⚠️ **Şartlar:**\n> • Discord durumunda `discord.gg/jap10`, `gg/jap10` veya `/jap10` yazmalıdır.\n> • Günde en fazla **2 adet** hesap alabilirsin (24 saatte bir yenilenir).')
                    .addFields(
                        { name: '📂 Kategori', value: '`steam`', inline: true },
                        { name: '🎭 Gerekli Durum', value: '`discord.gg/jap10`', inline: true },
                        { name: '📊 İstatistikler', value: `Dağıtılan: **${dagitilanSayisi}** \vert{} Stok: **${stokSayisi}**`, inline: false }
                    )
                    .setFooter({ text: 'Hesap Store • steam' });

                await interaction.message.edit({ embeds: [updatedEmbed] });
            } catch (e) {
                console.error("Panel güncellenirken hata oluştu:", e);
            }

            const kalanHak = 2 - data.cooldowns[userId].length;

            const accountEmbed = new EmbedBuilder()
                .setColor('#2b2d31')
                .setTitle('🔑 steam — Hesabın Hazır! 🎉')
                .setDescription(`Merhaba **${interaction.user.username}**! İşte hesabın:\n\n\`\`\`${account}\`\`\``)
                .addFields(
                    { name: '📁 Kategori', value: '`steam`', inline: true },
                    { name: '🎭 Rolün', value: '`Free`', inline: true },
                    { name: '📊 Kalan Hakkın', value: `\`${kalanHak}/2\``, inline: true },
                    { 
                        name: '⚠ Bilgi', 
                        value: 'Bu hesap bilgisi sadece sana özel (gizli) olarak gösterilmiştir. Başkasıyla paylaşma!', 
                        inline: false 
                    }
                )
                .setFooter({ text: 'Hesap Store • steam' });

            try {
                await interaction.user.send({ embeds: [accountEmbed] });
                await interaction.editReply({ content: '✅ Hesabın başarıyla **DM (Özel Mesaj) kutuna** gönderildi! Lütfen kontrol et.' });
            } catch (err) {
                await interaction.editReply({ 
                    content: '⚠️ DM kutun kapalı olduğu için hesabın buradan (sadece senin görebileceğin şekilde) paylaşıldı:', 
                    embeds: [accountEmbed] 
                });
            }
        }
    }
});

const TOKEN = process.env.BOT_TOKEN;
client.login(TOKEN);