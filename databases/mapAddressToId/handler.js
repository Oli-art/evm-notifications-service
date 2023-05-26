const fs = require('fs')
const { isAddress } = require('../utils')

// Load the map (eth address to discord id) from the JSON file
const loadMapAddressToId = function () {
  try {
    const data = fs.readFileSync('./databases/mapAddressToId/map_address_to_id.json', 'utf8')
    console.log(data)
    const entries = JSON.parse(data)

    // Convert arrays to sets
    const mapAddressToId = new Map(entries.map(([userAddress, id]) => [userAddress, new Set(id)]))

    return mapAddressToId
  } catch (error) {
    console.error('Error loading map from addres to id:', error)
    return new Map() // Return an empty Map if the file doesn't exist or there's an error
  }
}

// Save the mapAddressToId to the JSON file
const saveMapAddressToId = function (mapAddressToId) {
  try {
    const data = JSON.stringify(Array.from(mapAddressToId.entries()).map(([userAddress, id]) => [userAddress, Array.from(id)]), null, 2)
    console.log(data)
    fs.writeFileSync('./databases/mapAddressToId/map_address_to_id.json', data, 'utf8')
    console.log('mapAddressToId saved successfully.')
  } catch (error) {
    console.error('Error saving mapAddressToId:', error)
  }
}

// Handle the 'setAddress' command
const setAddress = function (interaction) {
  const address = interaction.options.getString('address')
  if (!isAddress(address)) {
    interaction.reply({ content: 'Please provide a valid address to set up.', ephemeral: true })
    return
  }

  // Add the user to the subscription list for the provided address
  const mapAddressToId = loadMapAddressToId()
  let userId = mapAddressToId.get(address)

  if (!userId) {
    userId = new Set([interaction.user.id])
  } else {
    userId.add(interaction.user.id)
  }
  mapAddressToId.set(address, userId)

  // Save the updated maps
  saveMapAddressToId(mapAddressToId)
  console.log(`${interaction.user.id} set up his address as ${address}`)

  interaction.reply({ content: `'${address}' is now set up as one of your addresses.`, ephemeral: true })
}

module.exports = { setAddress, loadMapAddressToId }
