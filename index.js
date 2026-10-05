const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Botun niyetleri (Intents) açık olmalı
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Mesaj içeriğini okuyabilmek için şarttır!
    ]
});

client.on('messageCreate', async (message) => {
    // Botun kendi mesajlarını veya diğer botları yoksay
    if (message.author.bot) return;

    // Sadece "!disney" komutunu dinle (Büyük/küçük harf duyarlılığını ortadan kaldırmak içintoLowerCase kullanabiliriz)
    if (message.content.trim().toLowerCase() === '!disney') {
        try {
            // disney_accounts.json dosyasını oku
            if (!fs.existsSync('./disney_accounts.json')) {
                return message.reply('❌ `disney_accounts.json` dosyası bulunamadı!');
            }

            const rawData = fs.readFileSync('./disney_accounts.json', 'utf8');
            const data = JSON.parse(rawData);

            // Hesap listesini kontrol et
            if (!data.accounts || data.accounts.length === 0) {
                return message.reply('⚠️ Şu anda stokta hiç Disney+ hesabı kalmadı!');
            }

            // Listeden rastgele bir hesap seç
            const randomIndex = Math.floor(Math.random() * data.accounts.length);
            const account = data.accounts[randomIndex];

            // Güvenlik için hesabı kullanıcıya özel mesaja (DM) gönderelim
            try {
                await message.author.send(`🎬 **Disney+ Hesabın:**\n\`\`\`${account}\`\`\``);
                await message.reply('✅ Disney+ hesabı başarıyla özel mesaj (DM) olarak gönderildi! (DM kutunu kontrol et)');
            } catch (dmError) {
                // Eğer kullanıcının DM kutusu kapalıysa kanaldan gönder
                await message.reply(`⚠️ Özel mesajların kapalı olduğu için hesabı buraya gönderiyorum:\n\`\`\`${account}\`\`\``);
            }

        } catch (error) {
            console.error(error);
            message.reply('❌ Hesap verilirken bir hata oluştu.');
        }
    }
});
