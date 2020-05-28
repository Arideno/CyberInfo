require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

import { processGetMatches } from './controllers/getLastMatches'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', async msg => {
  let message = msg.content
  let author = msg.author

  if (!author || author.username === 'cyberinfo-bot')
    return
  
  switch (message) {
    case '/get_info': {
      await processGetMatches(msg)
      break
    }
    default: {
      msg.reply('Action not found, type /help to get list of available actions')
      break
    }
  }
})

client.login(process.env.BOT_TOKEN)