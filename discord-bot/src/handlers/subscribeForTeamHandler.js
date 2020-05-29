import { reply } from './reply'
import { 
  subscribeForTeam, 
  getSubscribedUsernamesByTeamname,
  unsubscribeFromTeam
} from '../services/dbService'
import { getAllTeams } from '../services/apiService'
import { getOnlyActiveTeams } from './getTeamsHandler' 

const getReadableInfo = (usernames = []) => {
  let data = ['']
  for (let username of usernames) {
    data.push( `${username}` )
  }
  return data
}

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

    let infoMessage = getReadableInfo(usernames)

    reply(null, message, infoMessage)
  } catch (err) {
    reply(err, message, null)
  }
}