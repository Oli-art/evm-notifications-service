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

## Authors

- **Oliver Stehr**- *Created the service and the discord BOT.*

Thanks to [discordjs.guide](https://discordjs.guide/) for the guidance!

See also the list of
[contributors](https://github.com/Oli-art/evm-notifications-service/contributors)
who participated in this project.
