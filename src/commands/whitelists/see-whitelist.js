const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/whitelists/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('see_whitelist')
    .setDescription('See the whitelist of addresses allowed to send DMs to you'),
  async execute (interaction) {
    await handler.seeWhitelist(interaction)
  }
}
