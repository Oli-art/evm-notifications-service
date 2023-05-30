# EVM Notification Service

This is a service made to test EIP-7017.

It listens to contract events matching the ones described in the [EIP-7017](https://github.com/ethereum/EIPs/pull/7017/files?short_path=146c8a7#diff-146c8a7c8ef40fa58a8c36a845415ceb1a739450bb456d9ed86799b15cf2a4bb) and manages them to inform users connected to the service.

In the "discord" branches, the service includes a Discord BOT that messages users that are subscribed to the senders of messages.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine.

### Setup Quicknode

Quicknode is a service that can send a notification to the server once a certain criteria is met inside of a new transaction. In this case, we must setup a listener for events matching the ones defined in the EIP-7017, and send the transactions to our IP with the Service Port.

There are alternatives to using Quicknode, like communicating with an RPC directly, but the code should be changed in that case.

To setup quicknode:

1. Go to [https://www.quicknode.com/]() and create a free account.
2. Go to "Quick Alerts" and create a new alert.
3. Set it up to listen for events matching the following logic: `tx_logs_topic0 == '0x4159d024c8bbe3cf103f394927dbb700a529c595bc7632a1d072ce787bb4e077' || tx_logs_topic0 == '0x110e242e223bf857462015c8a80865a911ac4c44ed460fbc41957d52540a15c3'`
4. Set the destination of the alert to your service with the service port.

### Create a Discord BOT

1. Go to [https://discord.com/developers]()
2. Create a New Application

#### Bot invite links

The basic version of one such link looks like this:

```text
https://discord.com/api/oauth2/authorize?client_id=123456789012345678&permissions=0&scope=bot%20applications.commands
```

The structure of the URL is quite simple:

* `https://discord.com/api/oauth2/authorize` is Discord's standard structure for authorizing an OAuth2 application (such as your bot application) for entry to a Discord server.
* `client_id=...` is to specify *which* application you want to authorize. You'll need to replace this part with your client's id to create a valid invite link.
* `permissions=...` describes what permissions your bot will have on the server you are adding it to.
* `scope=bot%20applications.commands` specifies that you want to add this application as a Discord bot, with the ability to create slash commands.

Now you can paste this link in your explorer and invite the bot to a server of yours!

### Environment Variables

Create a `.env` file with the following variables:

* `SERVICE_PORT`= *the port at which the service will be listening for the events coming from "Quicknode".*

For the discord BOT, additional variables must be defined:

* `CLIENT_ID`= the ID of the BOT, to be found on the bot's *discord development portal > General Information > Application ID*
* `GUILD_ID`= the ID of the server (also called guild)
* `DISCORD_TOKEN`= the bot's token to login as the bot from the service, to be found on the bot's *discord development portal > Bot > Reset Token*

### Installing

Setup discord commands

    Before deploying, you should run`node deploy-commands.js`. This sets up the commands in your discord server so that you can preview them.

    You will see that when writing`/` in the server chat, you will see the commands defined in the service.

And deploy

    Run`node service.js`

Now you can go to the server and run `/subscribe "constract address"` and the bot will now send notifications to you via DM when the contract broadcasts or DMs something.

### Testing

One way to test the service is to create a contract implementing EIP-7017 in a testnet and then interacting with it to create a message event. With Quicknode set up you should get a request.

Alternatively, without using quicknode, you can set up a postman by importing the following JSON and replacing "PORT" with your port.

*Just a heads up: I wrote these tests late at night and the messages were uncreative (and in spanish).*

```json
{
	"info": {
		"_postman_id": "7c3837af-fe9b-41c4-b252-1c41e8a85704",
		"name": "EIP-7017 Discord BOT",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "BroadcastMsg 3.1",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "[\n    {\n        \"blockHash\":\"0x93a12f3010038a2e325dd5a511c8073237a3184ddc02fc2cae14971565802f74\",\n        \"blockNumber\":\"0x356c34\",\n        \"contractAddress\":\"NULL\",\n        \"cumulativeGasUsed\":\"0x1ba9f\",\n        \"effectiveGasPrice\":\"0x9502f908\",\n        \"from\":\"0x85b6f64bcf53ff649b2b43a11b04412a9f083be7\",\n        \"gasUsed\":\"0x727f\",\n        \"logs\":[\n           {\n                \"address\":\"0xb0c4d3b1d7690ac231b620e75cd21f9f30d2e7bd\",\n                \"topics\":[\n                    \"0x637d66261a00d313cbb684a70a2d34c007836c1d32406750ce0865e32ff9810d\",\n                    \"0x000000000000000000000000b0c4d3b1d7690ac231b620e75cd21f9f30d2e7bd\"\n                ],\n                \"data\":\"0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000000f486f6c612c207465737465616e646f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006059612065732074617264652079206d652071756965726f20697220612061636f737461722c20706f72206661766f722066756e63696f6e612061206c61207072696d6572612e204573746172ed612064652070616e612062616e616e612e2e2e00000000000000000000000000000000000000000000000000000000000000010300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006768747470733a2f2f657468657265756d2d6d6167696369616e732e6f72672f75706c6f6164732f64656661756c742f6f726967696e616c2f31582f346331643266383736353539616463356365356634313135666532303139643338636361633364622e706e67000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042657468657265756d3a3078666236393136303935636131646636306262373943653932636533656137346333376335643335393f76616c75653d322e303134653138000000000000000000000000000000000000000000000000000000000000\",\n                \"blockNumber\":\"0x36bb0b\",\n                \"transactionHash\":\"0x343b01d347f354720dc1aac533a6a3e3756489981dbb9e26eddc3c55dcff6975\",\n                \"transactionIndex\":\"0x3\",\n                \"blockHash\":\"0x08ec27ea231d8ea394962506f10ecb24f4de8595063fc841d55d242f1c69d5fa\",\n                \"logIndex\":\"0x0\",\n                \"removed\":false\n            }\n        ],\n        \"logsBloom\":\"0x00000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000808000000000000000000\",\n        \"status\":\"0x1\",\n        \"to\":\"0xc2cbdE8AaeB3F54fF1a735f09Dea590418c81172\",\n        \"transactionHash\":\"0x329cf5834939989b15e998725a7524315927c86fb50ba229e83476497c418759\",\n        \"transactionIndex\":\"0x4\",\n        \"type\":\"0x2\"\n    }\n]",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:25565",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "25565"
				}
			},
			"response": []
		},
		{
			"name": "WalletDM 2.1",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "[\n    {\n        \"blockHash\":\"0x4371938ec189abd143926e04aefa5829754ae4b4f7f15bb40ef98ab28ef89419\",\n        \"blockNumber\":\"0x3669b9\",\n        \"contractAddress\":\"NULL\",\n        \"cumulativeGasUsed\":\"0x1ba9f\",\n        \"effectiveGasPrice\":\"0x9502f908\",\n        \"from\":\"0x85b6f64bcf53ff649b2b43a11b04412a9f083be7\",\n        \"gasUsed\":\"0x727f\",\n        \"logs\":[\n           {\n                \"address\":\"0xb0c4d3b1d7690ac231b620e75cd21f9f30d2e7bd\",\n                \"topics\":[\n                    \"0x47ed6908c21ceb00e270f45c89850b2e97c26950007427528284d4338125e093\",\n                    \"0x000000000000000000000000b0c4d3b1d7690ac231b620e75cd21f9f30d2e7bd\",\n                    \"0x000000000000000000000000f4dd77381bcd09155e9563147086b36f1b5b30e7\"\n                ],\n                \"data\":\"0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000000f486f6c612c207465737465616e646f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006059612065732074617264652079206d652071756965726f20697220612061636f737461722c20706f72206661766f722066756e63696f6e612061206c61207072696d6572612e204573746172ed612064652070616e612062616e616e612e2e2e00000000000000000000000000000000000000000000000000000000000000010300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006768747470733a2f2f657468657265756d2d6d6167696369616e732e6f72672f75706c6f6164732f64656661756c742f6f726967696e616c2f31582f346331643266383736353539616463356365356634313135666532303139643338636361633364622e706e67000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000042657468657265756d3a3078666236393136303935636131646636306262373943653932636533656137346333376335643335393f76616c75653d322e303134653138000000000000000000000000000000000000000000000000000000000000\",\n                \"blockNumber\":\"0x36bb6c\",\n                \"transactionHash\":\"0xcfdec58b30de3eb381531bf401099486584c91fdbe516ad8faa2a56521b1fb87\",\n                \"transactionIndex\":\"0x1\",\n                \"blockHash\":\"0x4371938ec189abd143926e04aefa5829754ae4b4f7f15bb40ef98ab28ef89419\",\n                \"logIndex\":\"0x0\",\n                \"removed\":false\n            }\n        ],\n        \"logsBloom\":\"0x00000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000808000000000000000000\",\n        \"status\":\"0x1\",\n        \"to\":\"0xc2cbdE8AaeB3F54fF1a735f09Dea590418c81172\",\n        \"transactionHash\":\"0x6662df5bf8bd8fac4563b5f52ce87207596fed80bad438448f64c5937ddaf000\",\n        \"transactionIndex\":\"0x4\",\n        \"type\":\"0x2\"\n    }\n]",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:25565",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "25565"
				}
			},
			"response": []
		}
	]
}
```

## Authors

- **Oliver Stehr**- *Created the service and the discord BOT.*

Thanks to [discordjs.guide](https://discordjs.guide/) for the guidance!

See also the list of
[contributors](https://github.com/Oli-art/evm-notifications-service/contributors)
who participated in this project.
