require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

import { getSubscribedUsernamesByTeamname } from './services/dbService';
import { getMatchesHandler } from './handlers/getMatchesHandler'
import { getHelpHandler } from './handlers/getHelpHandler'
import { getTeamsHandler } from './handlers/getTeamsHandler'
import { 
  subscribeForTeamHandler, 
  getAllSubscribtionsByTeamnameHandler,
  unsubscribeFromTeamHandler
} from './handlers/subscribeForTeamHandler'

client.login(process.env.BOT_TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.setInterval(() => {
  let userIds = getSubscribedUsernamesByTeamname('NatusVincere')
  console.log(userIds, client.users.cache)
  userIds.forEach(userId => {
    client.users.cache.get(userId).send('kappa');
  })
}, 2000)

client.on('message', async msg => {
  let message = msg.content
  let author = msg.author

  if (!author || author.username === 'cyberinfo-bot')
    return

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