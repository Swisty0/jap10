const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban-list')
        .setDescription('Sunucudaki yasaklı kullanıcıları listeler.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const bans = await interaction.guild.bans.fetch();
            
            if (bans.size === 0) {
                return interaction.editReply('Sunucunuzda yasaklı (banlı) kimse bulunmuyor.');
            }

            const banList = bans.map(b => `• **${b.user.tag}** (${b.user.id}) - Sebep: *${b.reason || 'Belirtilmedi'}*`).join('\n');

            const embed = new EmbedBuilder()
                .setTitle('📋 Sunucu Yasaklılar Listesi')
                .setDescription(banList.slice(0, 4000)) // Discord karakter sınırına karşı koruma
                .setColor('Red')
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('Yasaklılar listesi alınırken bir hata oluştu!');
        }
    }
};