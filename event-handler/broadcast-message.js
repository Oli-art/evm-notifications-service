const handler = require('../databases/subscriptions/handler')
const { embedBuilder } = require('./utils')
const { AttachmentBuilder } = require('discord.js')
const blockies = require('../images/blockies')
const generateQRCode = require('../images/qr-generator')

// Handle incoming Discord events
module.exports = async function broadcastMessage (
    discordClient,
    sender,
    subject,
    body,
    image,
    transactionRequest
  ) {
    const subscriptions = handler.loadSubscriptions()
  
    // Iterate trough all users subscribed to the sender's address
    if (!subscriptions.has(sender)) {
      return
    }

    blockies(sender)
    generateQRCode(transactionRequest)
    const blockies_file = new AttachmentBuilder('./images/last-blockie.png')
    const qr_code = new AttachmentBuilder('./images/last-qr-code.png')
  
    await subscriptions.get(sender).forEach(async (userId) => {
      await discordClient.users
        .fetch(userId) // Fetch the user object using the user ID
        .then(async (user) => {
          await user.send({
            embeds: [embedBuilder(
              subject,
              body,
              sender,
              image,
              undefined,
              transactionRequest
            )],
            files: [blockies_file, qr_code] }) // Send the notification as a DM to the user
        })
        .catch((error) => {
          console.error(`Failed to send notification to user with ID ${userId}. Error: ${error}`)
        })
    })
  }