const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/whitelists/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwhitelist')
    .setDescription('Unwhitelist an address or contract to receive DMs from them')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('The address to unwhitelist')),
  async execute (interaction) {
    await handler.unwhitelist(interaction)
    console.log(`userId: ${interaction.user.id} has unwhitelisted: ${interaction.options.getString('address')}`)
  }
}
