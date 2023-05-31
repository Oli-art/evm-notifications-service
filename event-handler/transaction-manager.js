const broadcastMessage = require('./broadcast-message')
const directMessage = require('./direct-message')
const abi = require('web3-eth-abi')
const { hex2a, setBroadcastBodyOptions, setDMBodyOptions } = require('./utils')

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
        const {image, transactionRequest } = setBroadcastBodyOptions(data)

        // Send the message to all subscribed users
        await broadcastMessage(discordClient, sender, subject, body, image, transactionRequest)
      } else if (
        logs.topics[0] === '0x537e4e441398c7c96e1673ceff9c6b4783fc4cc8438691aa93e90721753211c6' // logs matches a DirectMsg event
      ) {
        const sender = abi.decodeParameters(['address'], logs.topics[1])[0].toLowerCase()
        const receiver = abi.decodeParameters(['address'], logs.topics[2])[0].toLowerCase()
        const data = abi.decodeParameters(['bytes[]', 'bool'], logs.data)
        const subject = hex2a(data[0][0])
        const body = hex2a(data[0][1])
        const is_encrypted = data[1]
        console.log("is_encrypted: ", is_encrypted)
        const {image, transactionRequest } = setDMBodyOptions(data)

        // Send the message to the recieving users
        await directMessage(discordClient, sender, subject, body, image, receiver, transactionRequest)
      }
    }
  }
}

module.exports = manageRequest

