const broadcastMessage = require('./broadcast-message')
const directMessage = require('./direct-message')
const abi = require('web3-eth-abi')
const { hex2a } = require('./utils')

const manageRequest = async function(requestData, discordClient) {
  for (let i = 0; i < requestData.length; i++) { // iterate trough the transactions matched in the block
    for (let j = 0; j < requestData[i].logs.length; j++) { // iterate trough the logs in the transaction
      const logs = requestData[i].logs[j]
      console.log(logs) // important for debugging
      if (
        logs.topics[0] === '0x4159d024c8bbe3cf103f394927dbb700a529c595bc7632a1d072ce787bb4e077' // log matches a BroadcastMsg event
      ) {
        const data = abi.decodeParameters(['string', 'bytes[]'], logs.data)
        const sender = abi.decodeLog(['address'], logs.topics[1])[0]
        const body = hex2a(data[1][0])
        // const attentionLevel = data[1][1]
        const image = data[1].length > 2 ? hex2a(data[1][2]) : undefined

        // Broadcast the message to all connected clients
        await broadcastMessage(discordClient, sender, data[0], body, image)
      } else if (
        logs.topics[0] === '0x110e242e223bf857462015c8a80865a911ac4c44ed460fbc41957d52540a15c3' // logs matches a DirectMsg event
      ) {
        const sender = abi.decodeParameters(['address'], logs.topics[1])[0]
        const receiver = abi.decodeParameters(['address'], logs.topics[2])[0]
        const data = abi.decodeParameters(['string', 'bytes[]'], logs.data)
        const body = hex2a(data[1][0])
        // const isEncrypted = data[1][1] == 0x01 ? true : false
        const image = data[1].length > 2 ? hex2a(data[1][2]) : undefined

        // Broadcast the message to all connected clients
        directMessage(discordClient, sender, data[0], body, image, receiver)
      }
    }
  }
}

module.exports = manageRequest

