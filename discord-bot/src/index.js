require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

import { getMatchesHandler } from './handlers/getMatchesHandler'
import { getHelpHandler } from './handlers/getHelpHandler'
import { getTeamsHandler } from './handlers/getTeamsHandler'
import { 
  subscribeForTeamHandler, 
  subscribeForAllTeamsHandler,
  getAllSubscribtionsByTeamnameHandler,
  unsubscribeFromTeamHandler
} from './handlers/subscribeForTeamHandler'
import {
  NOTIFICATION_TIMEOUT_IN_MILISECONDS,
  notificate
} from './services/notificationService'

// Login bot to Discord
client.login(process.env.BOT_TOKEN)

// Strating bot
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

// Fetch /proMatches api every NOTIFICATION_TIMEOUT_IN_MILISECONDS miliseconds
client.setInterval(async () => await notificate(client), NOTIFICATION_TIMEOUT_IN_MILISECONDS)

// Commands handlers
client.on('message', async msg => {
  let message = msg.content
  let author = msg.author

  if (!author || author.username === 'cyberinfo-bot')
    return

  if (message.startsWith('!subscribe_for_all')) {
    await subscribeForAllTeamsHandler(msg)
    return
  }

  if (message.startsWith('!subscribe')) {
    subscribeForTeamHandler(msg)
    return
  }

  if (message.startsWith('!unsubscribe')) {
    unsubscribeFromTeamHandler(msg)
    return
  }

  if (message.startsWith('!get_subs_by_teamname')) {
    getAllSubscribtionsByTeamnameHandler(msg)
    return
  }

  if (message.startsWith('!help')) {
    getHelpHandler(msg)
    return
  }

  if (message.startsWith('!get_all_teams')) {
    getTeamsHandler(msg)
    return
  }

  if (message.startsWith('!get_last_matches')) {
    getMatchesHandler(msg)
    return
  }

  if (message.startsWith('/') || message.startsWith('!')) {
    msg.reply('Action not found, type !help to get list of available actions')
    return
  }
})