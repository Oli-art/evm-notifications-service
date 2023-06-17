const fs = require('fs')
const { isAddress } = require('../utils')

// Load the whitelists from the JSON file
const loadWhitelists = function () {
  try {
    const data = fs.readFileSync('./src/databases/whitelists/whitelists.json', 'utf8')
    const entries = JSON.parse(data)

    // Convert arrays to sets
    const whitelists = new Map(entries.map(([address, userId]) => [address, new Set(userId)]))

    return whitelists
  } catch (error) {
    console.error('Error loading whitelists:', error)
    return new Map() // Return an empty Map if the file doesn't exist or there's an error
  }
}

// Save the whitelists to the JSON file
const saveWhitelists = function (whitelists) {
  try {
    const data = JSON.stringify(Array.from(whitelists.entries()).map(([address, userId]) => [address, Array.from(userId)]), null, 2)
    fs.writeFileSync('./src/databases/whitelists/whitelists.json', data, 'utf8')
    console.log('Whitelists saved successfully.')
  } catch (error) {
    console.error('Error saving whitelists:', error)
  }
}

// Handle the 'whitelist' command
const whitelist = function (interaction) {
  const address = interaction.options.getString('address').toLowerCase()
  if (!isAddress(address)) {
    interaction.reply({ content: 'Please provide a valid address to whitelist.', ephemeral: true })
    return
  }

  // Add the address to the whitelist for the user's id
  const whitelists = loadWhitelists()
  let users = whitelists.get(address)

  if (!users) {
    users = new Set([interaction.user.id])
  } else {
    users.add(interaction.user.id)
  }
  whitelists.set(address, users)

  // Save the updated whitelists
  saveWhitelists(whitelists)
  console.log(`${interaction.user.id} whitelisted ${address}`)

  interaction.reply({ content: `Whitelisted the '${address}' address.`, ephemeral: true })
}

// Handle the 'unwhitelist' command
const unwhitelist = async function (interaction) {
  const address = interaction.options.getString('address').toLowerCase()
  if (!isAddress(address)) {
    interaction.reply({ content: 'Please provide a valid address to unwhitelist from.', ephemeral: true })
    return
  }

  // Remove the address from the whitelist for the users address
  const whitelists = loadWhitelists()
  if (!whitelists.has(address)) {
    interaction.reply({ content: `Not whitelisted the '${address}' address.`, ephemeral: true })
    return
  }
  whitelists.get(address).delete(interaction.user.id)

  // Save the updated whitelists
  saveWhitelists(whitelists)
  console.log(`${interaction.user.id} unwhitelisted ${address}`)

  await interaction.reply({ content: `Unwhitelisted the '${address}' address.`, ephemeral: true })
}

// Handle the 'seeWhitelist' command
const seeWhitelist = async function (interaction) {
  const whitelistedAddresses = getWhitelist(interaction.user.id)

  if (whitelistedAddresses.length === 0) {
    await interaction.reply({ content: 'You have not whitelisted any addresses.', ephemeral: true })
  } else {
    await interaction.reply({ content: `You have whitelisted the following addresses: ${whitelistedAddresses.join(', ')}`, ephemeral: true })
  }
}

// This function is also needed by the event-handler to see if a user has a whitelist or not.
const getWhitelist = function(userId) {
  const whitelistedAddresses = []
  const whitelists = loadWhitelists()
  whitelists.forEach((users, address) => {
    if (users.has(userId)) {
      whitelistedAddresses.push(address)
    }
  })
  return whitelistedAddresses
}

module.exports = { unwhitelist, seeWhitelist, loadWhitelists, whitelist, getWhitelist }
