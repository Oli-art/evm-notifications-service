const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/mapAddressToId/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set_address')
    .setDescription('Set your address so you can receive DMs. Remember to whitelist addresses')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('Your address')),
  async execute (interaction) {
    await handler.setAddress(interaction)
    console.log(`userId: ${interaction.user.id} has set up his address as: ${interaction.options.getString('address')}`)
  }
}