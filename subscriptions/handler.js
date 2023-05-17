const fs = require('node:fs')
const { isAddress } = require('./utils')

// Load the subscriptions from the JSON file
const loadSubscriptions = function () {
  try {
    const data = fs.readFileSync('./subscriptions/subscriptions.json', 'utf8')
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
    console.log(data)
    fs.writeFileSync('./subscriptions/subscriptions.json', data, 'utf8')
    console.log('Subscriptions saved successfully.')
  } catch (error) {
    console.error('Error saving subscriptions:', error)
  }
}

// Handle the 'subscribe' command
const subscribe = function (interaction) {
  const address = interaction.options.getString('address')
  if (!isAddress(address)) {
    interaction.channel.send('Please provide a valid address to subscribe to.')
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

  interaction.channel.send(`Subscribed to the '${address}' address.`)
}

// Handle the 'unsubscribe' command
const unsubscribe = async function (interaction) {
  const address = interaction.options.getString('address')
  if (!isAddress(address)) {
    interaction.channel.send('Please provide a valid address to subscribe to.')
    return
  }

  // Remove the user from the subscription list for the provided address
  const subscriptions = loadSubscriptions()
  if (!subscriptions.has(address)) {
    interaction.channel.send(`Not subscribed to the '${address}' address.`)
    return
  }
  subscriptions.get(address).delete(interaction.user.id)

  // Save the updated subscriptions
  saveSubscriptions(subscriptions)

  await interaction.reply(`Unsubscribed from the '${address}' address.`)
}

// Handle the 'whitelist' command
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
