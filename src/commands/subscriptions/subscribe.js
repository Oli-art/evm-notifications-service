const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/subscriptions/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Subscribe to an address or contract')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('The address to subscribe to')),
  async execute (interaction) {
    await handler.subscribe(interaction)
    console.log(`userId: ${interaction.user.id} has subscribed to: ${interaction.options.getString('address')}`)
  }
}
