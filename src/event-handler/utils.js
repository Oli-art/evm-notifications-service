const { EmbedBuilder } = require('discord.js')
require('dotenv').config({ path: '.env.eip7017' });

const checkScam = function(sender, receipt, methodHash) {
  if (receipt.from.toLowerCase() === sender) {
    // sender is a wallet.
    const walletDMHash = process.env.WALLET_DM_HASH
    const walletBroadcastHash =  process.env.WALLET_BROADCAST_HASH
    if (methodHash != walletDMHash && methodHash != walletBroadcastHash) {
      // this is a likely fraudulent event emmission, as the sender is the contract caller, but the method executed was not as EIP-7017 states.
      console.log("LIKELY SCAMMY NOTIFICATION. RETURNING.")
      return false
    }
  } else if (receipt.to != sender) {
    // sender isn't a contract
    // this is a fraudulent transaction, as the sender is neither the contract nor the contract caller.
    console.log("SCAMMY NOTIFICATION. RETURNING.")
    return false
  }
  return true // not a scam (:
}

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

const setDMBodyOptions = function(data) {
  let image = undefined
  let transactionRequest = undefined

  if (data[0].length > 3) {
    // both image url and transaction request fields were provided.
    image = hex2a(data[0][2])
    transactionRequest = hex2a(data[0][3])
  } else if (data[0].length > 2){
    // either image url or transaction request fields were provided.
    if (checkImageURL(data[0][2])) {
      // an image url was provided
      image = hex2a(data[0][2])
    } else {
      transactionRequest = hex2a(data[0][2])
    }
  }
  return  { image, transactionRequest }
}

const setBroadcastBodyOptions = function(data) {
  let image = undefined
  let transactionRequest = undefined

  if (data[0].length > 4) {
    // both image url and transaction request fields were provided.
    image = hex2a(data[0][3])
    transactionRequest = hex2a(data[0][4])
  } else if (data[0].length > 3){
    // either image url or transaction request fields were provided.
    if (checkImageURL(data[0][3])) {
      // an image url was provided
      image = hex2a(data[0][3])
    } else {
      // a transaction request was provided
      transactionRequest = hex2a(data[0][3])
    }
  }
  return  { image, transactionRequest }
}

module.exports = {
  checkScam,
  checkImageURL,
  embedBuilder,
  hex2a,
  setBroadcastBodyOptions,
  setDMBodyOptions
}