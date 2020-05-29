import { reply } from './reply'
import { subscribeForTeam } from '../services/dbService'

export const subscribeForTeamHandler = (message) => {
  try {
    let username = message.author
    let messageContent = message.content
    let teamname = messageContent.substr(messageContent.indexOf('_') + 1)

    subscribeForTeam(username, teamname)

    let infoMessage = `Successfully subscribed ${username} on ${teamname}`

    reply(null, message, infoMessage)
  } catch (err) {
    reply(err, message, null)
  }
}