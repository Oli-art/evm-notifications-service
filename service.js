/* eslint-disable no-undef */
/* eslint-disable brace-style */
const fs = require('node:fs')
const path = require('node:path')
const http = require('http')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const manageRequest = require('./event-handler/transaction-manager')
require('dotenv').config()

/* ################################## DISCORD SERVICE ################################## */

// Discord bot token
const botToken = process.env.DISCORD_TOKEN

// Create a new Discord client instance
/* Intents define what information the client will recieve from the
Discord Websocket */
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages
  ]
})

/* The Collection class extends JavaScript's native Map class, and includes
more extensive, useful functionality. Collection is used to store and
efficiently retrieve commands for execution. */
discordClient.commands = new Collection()
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
      discordClient.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}

discordClient.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

// Login the Discord bot
discordClient.login(botToken)

/* ########## Handle incoming Discord messages ########## */
discordClient.on(Events.InteractionCreate, async interaction => {
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
        manageRequest(requestData, discordClient)

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
