const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/whitelists/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelist')
    .setDescription('Whitelist an address or contract to receive their DMs')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('The address to whitelist')),
  async execute (interaction) {
    console.log(`userId: ${interaction.user.id} has whitelisted: ${interaction.options.getString('address')}`)
    await handler.whitelist(interaction)
  }
}
