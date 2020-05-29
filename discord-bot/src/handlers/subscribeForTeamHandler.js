import { reply } from './reply'
import { 
  subscribeForTeam, 
  getSubscribedUsernamesByTeamname,
  unsubscribeFromTeam
} from '../services/dbService'
import { getAllTeams } from '../services/apiService'
import { getOnlyActiveTeams } from './getTeamsHandler' 

import { convertUsernamesToEmbed } from '../toEmbedUtils'

export const subscribeForTeamHandler = (message) => {
  try {
    let { id: usernameId, username } = message.author
    let args = message.content.split(/ +/).slice(1)
    let teamname = args.join('')

    subscribeForTeam(usernameId, teamname)

    let infoMessage = `Successfully subscribed ${username} on ${teamname}`

    reply(null, message, infoMessage)
  } catch (err) {
    reply(err, message, null)
  }
}

export const subscribeForAllTeamsHandler = async (message) => {
  try {
    let { id: usernameId, username } = message.author
    let args = message.content.split(/ +/).slice(1)

    let teams = await getAllTeams()
    teams = getOnlyActiveTeams(teams)
    teams.forEach(team => {
      subscribeForTeam(usernameId, team.name)
    })

    let infoMessage = `Successfully subscribed ${username} on all teams`

    reply(null, message, infoMessage)
  } catch (err) {
    reply(err, message, null)
  }
}

export const unsubscribeFromTeamHandler = (message) => {
  try {
    let { id: usernameId, username } = message.author
    let args = message.content.split(/ +/).slice(1)
    let teamname = args.join('')

    unsubscribeFromTeam(usernameId, teamname)

    let infoMessage = `Successfully unsubscribed ${username} from ${teamname}`

    reply(null, message, infoMessage)
  } catch (err) {
    reply(err, message, null)
  }
}

export const getAllSubscribtionsByTeamnameHandler = (message) => {
  try {
    let args = message.content.split(/ +/).slice(1)
    let teamname = args.join('')
    let usernames = getSubscribedUsernamesByTeamname(teamname)

    reply(null, message, convertUsernamesToEmbed(usernames))
  } catch (err) {
    reply(err, message, null)
  }
}