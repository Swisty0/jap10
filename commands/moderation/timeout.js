const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Kullanıcıya süreli susturma (zaman aşımı) verir.')
        .addUserOption(o => o.setName('kullanici').setDescription('Susturulacak kullanıcı').setRequired(true))
        .addIntegerOption(o => o.setName('sure').setDescription('Süre (Dakika cinsinden)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const mins = interaction.options.getInteger('sure');
        const member = await interaction.guild.members.fetch(user.id);
        
        await member.timeout(mins * 60 * 1000);
        await interaction.reply(`⏳ **${user.tag}** isimli kullanıcı ${mins} dakika süreyle susturuldu.`);
    }
};