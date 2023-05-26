const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/subscriptions/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unsubscribe')
    .setDescription('Unubscribe to an address or contract')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('The address to unsubscribe to')),
  async execute (interaction) {
    await handler.unsubscribe(interaction)
  }
}
