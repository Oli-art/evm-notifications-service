const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('See the commands available and how to use them'),
  async execute (interaction) {
    // const embed = new EmbedBuilder().setImage('https://polys.art/images/991.png')

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Commands')
      .addFields(
        { name: 'Subscription', value: 'You can subscribe to an address using `/subscribe` for the BOT to let you know when that address broadcasts a message. You can see your subscriptions using `/see_subscriptions` and you can unsubscribe using `/unsubscribe`.' },
        { name: '\u200B', value: ' ' },
        { name: 'Set up your addresses', value: 'You can set up what addresses are yours with `/setup_address` so you get notified when you get a DM. You can see your addresses using `/see_addresses` and you can unset them using `/unset_address`.'},
        { name: '\u200B', value: ' ' },
        { name: 'Whitelist', value: 'If you want to avoid spam in your DMs, you can add addresses to your whitelist so that you only receive DMs from them. If no address is whitelisted, you can receive DMs from anyone. To add an address to your whitelist, use `/whitelist`. You can see your whitelist using `/see_whitelist` and you can unwhitelist using `/unwhitelist`'},
      )

    await interaction.reply({ embeds: [exampleEmbed] })
  }
}