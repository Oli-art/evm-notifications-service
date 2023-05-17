const fs = require('fs')

// This file handles interactions with the subscritions registry

// Path to the JSON file for storing subscription data
const subscriptionsFilePath = './subscriptions.json'

// Load the subscriptions from the JSON file
const loadSubscriptions = function () {
  try {
    const data = fs.readFileSync(subscriptionsFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading subscriptions:', error)
    return new Map() // Return an empty Map if the file doesn't exist or there's an error
  }
}

// Save the subscriptions to the JSON file
const saveSubscriptions = function (subscriptions) {
  try {
    const data = JSON.stringify(Array.from(subscriptions.entries()))
    fs.writeFileSync(subscriptionsFilePath, data, 'utf8')
    console.log('Subscriptions saved successfully.')
  } catch (error) {
    console.error('Error saving subscriptions:', error)
  }
}

module.exports = { loadSubscriptions, saveSubscriptions }
