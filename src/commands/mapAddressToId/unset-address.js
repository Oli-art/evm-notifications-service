const { SlashCommandBuilder } = require('discord.js')
const handler = require('../../databases/mapAddressToId/handler')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unset_address')
    .setDescription(`Unset an address so you stop receiving it's DMs.`)
    .addStringOption(option =>
      option.setName('address')
        .setDescription('The address to unset')),
  async execute (interaction) {
    await handler.unsetAddress(interaction)
    console.log(`userId: ${interaction.user.id} has unset the address: ${interaction.options.getString('address')}`)
  }
}
