const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/subscriptions/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('see_subscriptions')
    .setDescription('See the addresses you are subscribed to'),
  async execute (interaction) {
    await handler.seeSubscriptions(interaction)
  }
}
