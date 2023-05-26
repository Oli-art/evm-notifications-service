const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute (interaction) {
    // const embed = new EmbedBuilder().setImage('https://polys.art/images/991.png')

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Some title')
      .setAuthor({ name: 'Some name', iconURL: 'https://polys.art/images/991.png', url: 'https://discord.js.org' })
      .setDescription('Some description here')
      .setThumbnail('https://polys.art/images/991.png')
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
      )
      .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
      .setImage('https://polys.art/images/991.png')
      .setTimestamp()
      .setFooter({ text: 'Some footer text here', iconURL: 'https://polys.art/images/991.png' })

    await interaction.reply({ embeds: [exampleEmbed] })
  }
}
