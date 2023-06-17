const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/mapAddressToId/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('see_my_addresses')
    .setDescription('See the addresses you own and receive DMs to'),
  async execute (interaction) {
    await handler.seeAddresses(interaction)
  }
}
