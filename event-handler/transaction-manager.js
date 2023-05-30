const broadcastMessage = require('./broadcast-message')
const directMessage = require('./direct-message')
const abi = require('web3-eth-abi')
const { hex2a, setBodyOptions } = require('./utils')

const manageRequest = async function(requestData, discordClient) {
  for (let i = 0; i < requestData.length; i++) { // iterate trough the transactions matched in the block
    for (let j = 0; j < requestData[i].logs.length; j++) { // iterate trough the logs in the transaction
      const logs = requestData[i].logs[j]
      console.log(logs) // important for debugging
      if (
        logs.topics[0] === '0x637d66261a00d313cbb684a70a2d34c007836c1d32406750ce0865e32ff9810d' // log matches a BroadcastMsg event
      ) {
        const data = abi.decodeParameters(['bytes[]'], logs.data)
        const sender = abi.decodeLog(['address'], logs.topics[1])[0].toLowerCase()
        const subject = hex2a(data[0][0])
        const body = hex2a(data[0][1])
        // const attentionLevel = data[0][2]
        const {image, transactionRequest } = setBodyOptions(data)

        // Broadcast the message to all connected clients
        await broadcastMessage(discordClient, sender, subject, body, image, transactionRequest)
      } else if (
        logs.topics[0] === '0x47ed6908c21ceb00e270f45c89850b2e97c26950007427528284d4338125e093' // logs matches a DirectMsg event
      ) {
        const sender = abi.decodeParameters(['address'], logs.topics[1])[0].toLowerCase()
        const receiver = abi.decodeParameters(['address'], logs.topics[2])[0].toLowerCase()
        const data = abi.decodeParameters(['bytes[]'], logs.data)
        const subject = hex2a(data[0][0])
        const body = hex2a(data[0][1])
        // const isEncrypted = data[0][2] == 0x01 ? true : false
        const {image, transactionRequest } = setBodyOptions(data)

        // Broadcast the message to all connected clients
        await directMessage(discordClient, sender, subject, body, image, receiver, transactionRequest)
      }
    }
  }
}

module.exports = manageRequest

