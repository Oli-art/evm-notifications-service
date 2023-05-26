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

```json
{
	"info": {
		"_postman_id": "7ce5ee67-1503-4652-9829-9495daeed598",
		"name": "EVM Notifications",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Basic BroadcastMsg",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "[\n    {\n        \"blockHash\":\"0x93a12f3010038a2e325dd5a511c8073237a3184ddc02fc2cae14971565802f74\",\n        \"blockNumber\":\"0x356c34\",\n        \"contractAddress\":\"NULL\",\n        \"cumulativeGasUsed\":\"0x1ba9f\",\n        \"effectiveGasPrice\":\"0x9502f908\",\n        \"from\":\"0x85b6f64bcf53ff649b2b43a11b04412a9f083be7\",\n        \"gasUsed\":\"0x727f\",\n        \"logs\":[\n           {\n                \"address\":\"0xc2cbde8aaeb3f54ff1a735f09dea590418c81172\",\n                \"topics\":[\n                    \"0x4159d024c8bbe3cf103f394927dbb700a529c595bc7632a1d072ce787bb4e077\",\n                    \"0x000000000000000000000000c2cbde8aaeb3f54ff1a735f09dea590418c81172\"\n                ],\n                \"data\":\"0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000557454e41410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0486f6c61206d756e646f2c206573746f20657320756e2074657374207061726120656c204549502d373031372c207369656e646f206573746520656c20227375626a656374222064656c206d656e73616a652e204573746172ed61206275656e6f207369206573207175652070756469657365206167726567617220756e206c696e6b206120756e6120696de167656e206f20616c676f206de17320717565207375656c656e2074656e6572206c6173206e6f74696669636163696f6e65732e\",\n                \"blockNumber\":\"0x356d2a\",\n                \"transactionHash\":\"0xffd5031cd17748d57e9a24aa6d8fe621e0c037b90dec38ed150f9bd70dc7f095\",\n                \"transactionIndex\":\"0x5\",\n                \"blockHash\":\"0xe06ec93088df8d650d7035dc08aba0c58f9b93f1ad01af9db594731a2709f9e8\",\n                \"logIndex\":\"0x9\",\n                \"removed\":false\n            }\n        ],\n        \"logsBloom\":\"0x00000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000808000000000000000000\",\n        \"status\":\"0x1\",\n        \"to\":\"0xc2cbdE8AaeB3F54fF1a735f09Dea590418c81172\",\n        \"transactionHash\":\"0x6662df5bf8bd8fac4563b5f52ce87207596fed80bad438448f64c5937ddaf000\",\n        \"transactionIndex\":\"0x4\",\n        \"type\":\"0x2\"\n    }\n]",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:PORT",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "PORT"
				}
			},
			"response": []
		},
		{
			"name": "BroadcastMsg with image",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "[\n    {\n        \"blockHash\":\"0x93a12f3010038a2e325dd5a511c8073237a3184ddc02fc2cae14971565802f74\",\n        \"blockNumber\":\"0x356c34\",\n        \"contractAddress\":\"NULL\",\n        \"cumulativeGasUsed\":\"0x1ba9f\",\n        \"effectiveGasPrice\":\"0x9502f908\",\n        \"from\":\"0x85b6f64bcf53ff649b2b43a11b04412a9f083be7\",\n        \"gasUsed\":\"0x727f\",\n        \"logs\":[\n           {\n                \"address\":\"0xc2cbde8aaeb3f54ff1a735f09dea590418c81172\",\n                \"topics\":[\n                    \"0x4159d024c8bbe3cf103f394927dbb700a529c595bc7632a1d072ce787bb4e077\",\n                    \"0x000000000000000000000000c2cbde8aaeb3f54ff1a735f09dea590418c81172\"\n                ],\n                \"data\":\"0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000013496d706f7274616e74652050726f677265736f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000705365206861206c6f677261646f20756e20696d706f7274616e74652070726f677265736f3a20506f72207072696d6572612076657a2c20756e6120696de167656e207669656e652061736f6369616461206120756e61206e6f7469666963616369f36e206465204549502d373031372e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002068747470733a2f2f692e696d6775722e636f6d2f686164783531722e6a706567\",\n                \"blockNumber\":\"0x363b8d\",\n                \"transactionHash\":\"0xffd5031cd17748d57e9a24aa6d8fe621e0c037b90dec38ed150f9bd70dc7f095\",\n                \"transactionIndex\":\"0xb\",\n                \"blockHash\":\"0x05cd5c107f10cd999e8cbcc85b7b23ae7f16bdd1da3b00e77ead953fafd4544b\",\n                \"logIndex\":\"0x10\",\n                \"removed\":false\n            }\n        ],\n        \"logsBloom\":\"0x00000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000840000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000808000000000000000000\",\n        \"status\":\"0x1\",\n        \"to\":\"0xc2cbdE8AaeB3F54fF1a735f09Dea590418c81172\",\n        \"transactionHash\":\"0x6662df5bf8bd8fac4563b5f52ce87207596fed80bad438448f64c5937ddaf000\",\n        \"transactionIndex\":\"0x4\",\n        \"type\":\"0x2\"\n    }\n]",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:PORT",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "PORT"
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
