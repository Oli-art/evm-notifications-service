const abi = require('web3-eth-abi')

const broadcastMessage = require('./messages/broadcast-message')
const directMessage = require('./messages/direct-message')
const { hex2a, setBroadcastBodyOptions, setDMBodyOptions, checkScam } = require('./utils')

const manageRequest = async function(requestData, discordClient) {
  for (let i = 0; i < requestData.matchedReceipts.length; i++) { // iterate trough the transactions matched in the block
    const allLogs = requestData.matchedReceipts[i].logs
    for (let j = 0; j < allLogs.length; j++) { // iterate trough the logs in the transaction
      const logs = allLogs[j]
      const transactionInput = requestData.matchedTransactions[i].input
      const methodHash = transactionInput.substring(0,10)

      switch (logs.topics[0]) {
        case process.env.BROADCAST_MSG_TOPIC: { // topic matches a BroadcastMsg event
          const data = abi.decodeParameters(['bytes[]'], logs.data)
          const sender = abi.decodeLog(['address'], logs.topics[1])[0].toLowerCase()
          const subject = hex2a(data[0][0])
          const body = hex2a(data[0][1])
          // const attentionLevel = data[0][2]
          const {image, transactionRequest } = setBroadcastBodyOptions(data)
  
          // check if contract is malitious
          if (!checkScam(sender, requestData.matchedReceipts[i], methodHash)) { return }
  
          // Send the message to all subscribed users
          await broadcastMessage(discordClient, sender, subject, body, image, transactionRequest)
          continue;
        }

        case process.env.DIRECT_MSG_TOPIC: {// topic matches a DirectMsg event
          const sender = abi.decodeParameters(['address'], logs.topics[1])[0].toLowerCase()
          const receiver = abi.decodeParameters(['address'], logs.topics[2])[0].toLowerCase()
          const data = abi.decodeParameters(['bytes[]', 'bool'], logs.data)
          const subject = hex2a(data[0][0])
          const body = hex2a(data[0][1])
          const is_encrypted = data[1]
          console.log("is_encrypted: ", is_encrypted)
          const {image, transactionRequest } = setDMBodyOptions(data)
  
          // check if contract is malitious
          if (!checkScam(sender, requestData.matchedReceipts[i], methodHash)) { return }
  
          // Send the message to the recieving users
          await directMessage(discordClient, sender, subject, body, image, receiver, transactionRequest)
          continue;
        }
      }
    }
  }
}

module.exports = manageRequest

