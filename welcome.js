const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
    // Yeni üye sunucuya katıldığında tetiklenir
    client.on('guildMemberAdd', async (member) => {
        try {
            // 1. Otomatik Rol Verme ("Free" rolü)
            let role = member.guild.roles.cache.find(r => r.name === "Free");
            if (role) {
                await member.roles.add(role).catch(err => console.log('Rol verilemedi:', err));
            }

            // 2. Karşılama Mesajı Gönderilecek Kanal (Kanal adını kendi sunucundaki karşılama kanalının adıyla değiştirebilirsin)
            const welcomeChannelName = "kader-bizi-buluşturdu"; // Örnek kanal adı: #hosgeldin
            const channel = member.guild.channels.cache.find(c => c.name === welcomeChannelName);

            if (!channel) return;

            // Şık Bir Karşılama Embed Tasarımı
            const embed = new EmbedBuilder()
                .setColor('#113ccf')
                .setTitle('Hoşgeldin Aslan Kardeşim Durum Çekerek İmkanlardan faydalanabilirsin ! ')
                .setDescription(` <a:kylockz_Onay:1556302881496240219> ${member},**Seninle birlikte:** \`${member.guild.memberCount}\` kişiyiz`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setFooter({ text: 'Jap10 • System', iconURL: member.guild.iconURL({ dynamic: true }) })
                .setTimestamp();

            await channel.send({ content: `${member}`, embeds: [embed] });

        } catch (error) {
            console.error('Welcome modülünde bir hata oluştu:', error);
        }
    });
};
