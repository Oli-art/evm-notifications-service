const { AttachmentBuilder } = require('discord.js')

const whitelistHandler = require('../../databases/whitelists/handler')
const mapAddressToIdHandler = require('../../databases/mapAddressToId/handler')
const { embedBuilder } = require('../utils')
const blockies = require('../../images/blockies')
const generateQRCode = require('../../images/qr-generator')

// Handle incoming Discord events
module.exports = async function directMessage (
    discordClient,
    sender,
    subject,
    body,
    image,
    receiver,
    transactionRequest
  ) {
    const mapAddressToId = mapAddressToIdHandler.loadMapAddressToId()
  
    // Iterate trough all receivers to see if someone has set it up as his.
    if (!mapAddressToId.has(receiver)) {
      return
    }
  
    await mapAddressToId.get(receiver).forEach(async (userId) => {
      const userWhitelist = whitelistHandler.getWhitelist(userId)
      // check if user has whitelisted the sender
      if (userWhitelist.includes(sender.toLowerCase()) || userWhitelist.length == 0 ) {
        blockies(sender)
        generateQRCode(transactionRequest)
        const blockies_file = new AttachmentBuilder('./src/images/last-blockie.png')
        const qr_code = new AttachmentBuilder('./src/images/last-qr-code.png')
        await discordClient.users
        .fetch(userId) // Fetch the user object using the user ID
        .then(async (user) => {
          await user.send({
            embeds: [embedBuilder(
              subject,
              body,
              sender,
              image,
              receiver,
              transactionRequest
            )],
            files: [blockies_file, qr_code] }) // Send the notification as a DM to the user
        })
        .catch((error) => {
          console.error(`Failed to send notification to user with ID ${userId}. Error: ${error}`)
        })
      }
    })
  }