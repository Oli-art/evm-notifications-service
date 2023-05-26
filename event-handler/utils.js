const { EmbedBuilder } = require('discord.js')

const hex2a = function (hex) {
  let str = ''
  for (let i = 2; i < hex.length; i += 2) {
    const v = parseInt(hex.substr(i, 2), 16)
    if (v) str += String.fromCharCode(v)
  }
  return str
}

const embedBuilder = function(subject, body, sender, thumbnail, receiver) {
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(subject)
    .setAuthor({ name: sender, iconURL: 'attachment://last-blockie.png', url: `https://etherscan.io/address/${sender}` })
    .setDescription(body)
    .setTimestamp()
    .setFooter({ text: 'Consider discussing the EIP-7017!', iconURL: 'https://polys.art/images/397.png' })

    if (thumbnail) {
      embed.setImage(thumbnail)
    }
    if (receiver) {
      embed.addFields({ name: `DM to ${receiver}`, value: ' ' })
    }
  return embed
}

module.exports = { hex2a, embedBuilder }
