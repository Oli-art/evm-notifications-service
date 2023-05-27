const fs = require('node:fs')
const { isAddress } = require('../utils')

// Load the subscriptions from the JSON file
const loadSubscriptions = function () {
  try {
    const data = fs.readFileSync('./databases/subscriptions/subscriptions.json', 'utf8')
    const entries = JSON.parse(data)

    // Convert arrays to sets
    const subscriptions = new Map(entries.map(([address, users]) => [address, new Set(users)]))

    return subscriptions
  } catch (error) {
    console.error('Error loading subscriptions:', error)
    return new Map() // Return an empty Map if the file doesn't exist or there's an error
  }
}

// Save the subscriptions to the JSON file
const saveSubscriptions = function (subscriptions) {
  try {
    const data = JSON.stringify(Array.from(subscriptions.entries()).map(([address, users]) => [address, Array.from(users)]), null, 2)
    fs.writeFileSync('./databases/subscriptions/subscriptions.json', data, 'utf8')
    console.log('Subscriptions saved successfully.')
  } catch (error) {
    console.error('Error saving subscriptions:', error)
  }
}

// Handle the 'subscribe' command
const subscribe = function (interaction) {
  const address = interaction.options.getString('address').toLowerCase()
  if (!isAddress(address)) {
    interaction.reply({ content: 'Please provide a valid address to subscribe to.', ephemeral: true })
    return
  }

  // Add the user to the subscription list for the provided address
  const subscriptions = loadSubscriptions()
  let users = subscriptions.get(address)

  if (!users) {
    users = new Set([interaction.user.id])
  } else {
    users.add(interaction.user.id)
  }
  subscriptions.set(address, users)

  // Save the updated subscriptions
  saveSubscriptions(subscriptions)
  console.log(`${interaction.user.id} subscribed to ${address}`)

  interaction.reply({ content: `Subscribed to the '${address}' address.`, ephemeral: true })
}

// Handle the 'unsubscribe' command
const unsubscribe = async function (interaction) {
  const address = interaction.options.getString('address').toLowerCase()
  if (!isAddress(address)) {
    interaction.reply({ content: 'Please provide a valid address to unsubscribe from.', ephemeral: true })
    return
  }

  // Remove the user from the subscription list for the provided address
  const subscriptions = loadSubscriptions()
  if (!subscriptions.has(address)) {
    interaction.reply({ content: `Not subscribed to the '${address}' address.`, ephemeral: true })
    return
  }
  subscriptions.get(address).delete(interaction.user.id)

  // Save the updated subscriptions
  saveSubscriptions(subscriptions)
  console.log(`${interaction.user.id} unsubscribed from ${address}`)

  await interaction.reply({ content: `Unsubscribed from the '${address}' address.`, ephemeral: true })
}

// Handle the 'seeSubscriptions' command
const seeSubscriptions = async function (interaction) {
  const subscribedAddresses = []
  const subscriptions = loadSubscriptions()
  subscriptions.forEach((users, address) => {
    if (users.has(interaction.user.id)) {
      subscribedAddresses.push(address)
    }
  })

  if (subscribedAddresses.length === 0) {
    await interaction.reply({ content: 'You are not subscribed to any addresses.', ephemeral: true })
  } else {
    await interaction.reply({ content: `You are subscribed to the following addresses: ${subscribedAddresses.join(', ')}`, ephemeral: true })
  }
}

module.exports = { subscribe, unsubscribe, seeSubscriptions, loadSubscriptions }
