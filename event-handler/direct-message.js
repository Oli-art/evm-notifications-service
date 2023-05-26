const whitelistHandler = require('../databases/whitelists/handler')
const mapAddressToIdHandler = require('../databases/mapAddressToId/handler')
const { embedBuilder } = require('./utils')
const { AttachmentBuilder } = require('discord.js')
const blockies = require('./blockies')

// Handle incoming Discord events
module.exports = async function directMessage (
    discordClient,
    sender,
    subject,
    body,
    image,
    receiver
  ) {
    const mapAddressToId = mapAddressToIdHandler.loadMapAddressToId()
    const whitelists = whitelistHandler.loadWhitelists()
  
    // Iterate trough all receivers to see if someone has set it up as his.
    if (!mapAddressToId.has(receiver)) {
      return
    }
  
    await mapAddressToId.get(receiver).forEach(async (userId) => {
      // check if user has whitelisted the sender
      if (whitelists.get(receiver).includes(sender)) {
        await discordClient.users
        .fetch(userId) // Fetch the user object using the user ID
        .then(async (user) => {
          await blockies(sender)
          const file = new AttachmentBuilder('./images/last-blockie.png')
          await user.send({ embeds: [embedBuilder(subject, body, sender, image, receiver)], files: [file] }) // Send the notification as a DM to the user
        })
        .catch((error) => {
          console.error(`Failed to send notification to user with ID ${userId}. Error: ${error}`)
        })
      }
    })
  }