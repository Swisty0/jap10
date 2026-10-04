const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kullanıcıyı sunucudan atar.')
        .addUserOption(o => o.setName('kullanici').setDescription('Atılacak kullanıcı').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const member = await interaction.guild.members.fetch(user.id);
        
        await member.kick();
        await interaction.reply(`👢 **${user.tag}** sunucudan atıldı.`);
    }
};