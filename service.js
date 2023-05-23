/* eslint-disable brace-style */
const fs = require('node:fs')
const path = require('node:path')
const http = require('http')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const handler = require('./subscriptions/handler')
const abi = require('web3-eth-abi')
const hex2a = require('./utils')
require('dotenv').config()

/* ################################## DISCORD SERVICE ################################## */

// Discord bot token
const botToken = process.env.DISCORD_TOKEN

// Create a new Discord client instance
/* Intents define what information the client will recieve from the
Discord Websocket */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages
  ]
})

/* The Collection class extends JavaScript's native Map class, and includes
more extensive, useful functionality. Collection is used to store and
efficiently retrieve commands for execution. */
client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

// Login the Discord bot
client.login(botToken)

/* ########## Handle incoming Discord messages ########## */
client.on(Events.InteractionCreate, async interaction => {
  // Ignore interactions that are not an "isChatInputCommand"
  if (
    !interaction.isChatInputCommand()
  ) {
    return
  }

  // get the matching command from the client.commands Collection based on the interaction.commandName
  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }
  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
  }
})

// Handle incoming Discord events
async function broadcastMessage (message, sender) {
  const subscriptions = handler.loadSubscriptions()

  // Iterate trough all users subscribed to the sender's address
  if (!subscriptions.has(sender)) {
    return
  }

  await subscriptions.get(sender).forEach(async (userId) => {
    await client.users
      .fetch(userId) // Fetch the user object using the user ID
      .then(async (user) => {
        await user.send(message) // Send the notification as a DM to the user
      })
      .catch((error) => {
        console.error(`Failed to send notification to user with ID ${userId}. Error: ${error}`)
      })
  })
}

/* ################################## EVENT LISTENER ################################## */

// Create an HTTP server (to receive transactions that contain notification events from Quicknode)
const server = http.createServer()

// Handle incoming HTTP POST requests
server.on('request', (req, res) => {
  if (req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', async () => {
      try {
        const requestData = JSON.parse(body)

        // Handle the request data
        for (let i = 0; i < requestData.length; i++) { // iterate trough the transactions matched in the block
          for (let j = 0; j < requestData[i].logs.length; j++) { // iterate trough the logs in the transaction
            const logs = requestData[i].logs[j]
            if (
              logs.topics[0] === '0x4159d024c8bbe3cf103f394927dbb700a529c595bc7632a1d072ce787bb4e077' // log matches a BroadcastMsg event
            ) {
              const data = abi.decodeParameters(['string', 'bytes[]'], logs.data)
              const body = hex2a(data[1][0])
              const sender = abi.decodeLog(['address'], logs.topics[1])[0]
              const message = `Broadcast from ${sender}:\nSubject: ${data[0]}\n${body}`
              console.log(message)

              // Broadcast the message to all connected clients
              await broadcastMessage(message, sender)
            } else if (
              logs.topics[0] === '0x110e242e223bf857462015c8a80865a911ac4c44ed460fbc41957d52540a15c3' // logs matches a DirectMsg event
            ) {
              const sender = abi.decodeParameters(['address'], logs.topics[1])[0]
              const receiver = abi.decodeParameters(['address'], logs.topics[2])[0]
              const data = abi.decodeParameters(['string', 'bytes[]'], logs.data)
              const body = hex2a(data[1][0])
              const message = `DM from ${sender} to ${receiver}:\nSubject: ${data[0]}\n${body}`
              console.log(message)

              // Broadcast the message to all connected clients
              broadcastMessage(message, sender)
            }
          }
        }

        // Send a response
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'Request handled successfully.' }))
      } catch (error) {
        console.error(`Failed to parse request body. Error: ${error}`)
        res.statusCode = 400
        res.end('Error parsing request body.')
      }
    })
  } else {
    res.statusCode = 404
    res.end('Not Found')
  }
})

// Service Port to receive events
const servicePort = process.env.SERVICE_PORT

server.listen(servicePort, () => {
  console.log(`Server listening on port ${servicePort}`)
})
