const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../subscriptions/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Subscribe to an address or contract')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('The address to subscribe to')),
  async execute (interaction) {
    console.log(`userId: ${interaction.user.id} has subscribed to: ${interaction.options.getString('address')}`)
    await handler.subscribe(interaction)
  }
}
