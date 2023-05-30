const { EmbedBuilder } = require('discord.js')

const checkImageURL = function(url) {
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

const embedBuilder = function(subject, body, sender, image, receiver, transactionRequest) {
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(subject)
    .setAuthor({ name: sender, iconURL: 'attachment://last-blockie.png', url: `https://etherscan.io/address/${sender}` })
    .setDescription(body)
    .setTimestamp()
    .setFooter({ text: 'Consider discussing the EIP-7017!', iconURL: 'https://polys.art/images/397.png' })

    if (image) {
      embed.setImage(image)
    }
    if (transactionRequest) {
      embed.setThumbnail('attachment://last-qr-code.png')
    }
    if (receiver) {
      embed.addFields({ name: `DM to ${receiver}`, value: ' ' })
    }
  return embed
}

const hex2a = function (hex) {
  let str = ''
  for (let i = 2; i < hex.length; i += 2) {
    const v = parseInt(hex.substr(i, 2), 16)
    if (v) str += String.fromCharCode(v)
  }
  return str
}

const setBodyOptions = function(data) {
  let image = undefined
  let transactionRequest = undefined
  // const attentionLevel = data[0][2]
  if (data[0].length > 3) {
    // both image url and transaction request fields were provided.
    image = hex2a(data[0][3])
    transactionRequest = hex2a(data[0][4])
  } else if (data[0].length > 2){
    // either image url or transaction request fields were provided.
    if (checkImageURL(data[0][3])) {
      // an image url was provided
      transactionRequest = hex2a(data[0][3])
    }
  }
  return  { image, transactionRequest }
}

module.exports = { hex2a, embedBuilder, checkImageURL, setBodyOptions }
