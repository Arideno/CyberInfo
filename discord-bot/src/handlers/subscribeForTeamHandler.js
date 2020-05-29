import { reply } from './reply'
import { 
  subscribeForTeam, 
  getSubscribedUsernamesByTeamname,
  unsubscribeFromTeam
} from '../services/dbService'

const getReadableInfo = (usernames = []) => {
  let data = ['']
  for (let username of usernames) {
    data.push( `${username}` )
  }
  return data
}

export const subscribeForTeamHandler = (message) => {
  try {
    let { id: usernameId, author: username } = message
    let args = message.content.split(/ +/).slice(1)
    let teamname = args.join('')

    subscribeForTeam(usernameId, teamname)

    let infoMessage = `Successfully subscribed ${username} on ${teamname}`

    reply(null, message, infoMessage)
  } catch (err) {
    reply(err, message, null)
  }
}

export const unsubscribeFromTeamHandler = (message) => {
  try {
    let { id: usernameId, author: username } = message
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