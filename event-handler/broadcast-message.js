const handler = require('../databases/subscriptions/handler')
const { embedBuilder } = require('./utils')
const { AttachmentBuilder } = require('discord.js')
const blockies = require('./blockies')

// Handle incoming Discord events
module.exports = async function broadcastMessage (
    discordClient,
    sender,
    subject,
    body,
    image
  ) {
    const subscriptions = handler.loadSubscriptions()
  
    // Iterate trough all users subscribed to the sender's address
    if (!subscriptions.has(sender)) {
      return
    }
  
    await subscriptions.get(sender).forEach(async (userId) => {
      await discordClient.users
        .fetch(userId) // Fetch the user object using the user ID
        .then(async (user) => {
          await blockies(sender)
          const file = new AttachmentBuilder('./images/last-blockie.png')
          await user.send({ embeds: [embedBuilder(subject, body, sender, image, undefined)], files: [file] }) // Send the notification as a DM to the user
        })
        .catch((error) => {
          console.error(`Failed to send notification to user with ID ${userId}. Error: ${error}`)
        })
    })
  }