require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

import { getMatchesHandler } from './handlers/getMatchesHandler'
import { getHelpHandler } from './handlers/getHelpHandler'
import { getTeamsHandler } from './handlers/getTeamsHandler'
import { subscribeForTeamHandler } from './handlers/subscribeForTeamHandler'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', async msg => {
  let message = msg.content
  let author = msg.author

  if (!author || author.username === 'cyberinfo-bot')
    return

  console.log(message, message.startsWith('/subscribe'))

  if (message.startsWith('/subscribe')) {
    subscribeForTeamHandler(msg)
    return
  }

  if (message.startsWith('/help')) {
    getHelpHandler(msg)
    return
  }

  if (message.startsWith('/get_all_teams')) {
    getTeamsHandler(msg)
    return
  }

  if (message.startsWith('/get_last_matches')) {
    getMatchesHandler(msg)
    return
  }

  msg.reply('Action not found, type /help to get list of available actions')
})

client.login(process.env.BOT_TOKEN)