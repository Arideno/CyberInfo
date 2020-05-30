import { 
  getMatchesByTeamId,
  getAllTeams
} from '../services/apiService'
import { reply } from './reply'

import { convertTeamInfoToEmbed } from '../toEmbedUtils'

export const getTeamInfoByTeamname = async (message) => {
  try {
    let { id: usernameId, username } = message.author
    let teamname = message.content.split(/ +/).slice(1).join('')

    let teams = await getAllTeams()

    let team = teams.find(team => {
      let { name, tag } = team
      name = name.split(/ +/).join('')
      tag = tag.split(/ +/).join('')

      return name === teamname || tag === teamname
    })

    if (!team) {
      throw new Error(`Team ${teamname} was not found`)
    }

    let { team_id: teamId } = team

    let matches = await getMatchesByTeamId(teamId)
    matches = matches.slice(0, 5)

    team.matches = matches

    reply(null, message, convertTeamInfoToEmbed(team))
  } catch (err) {
    reply(err, message, null)
  }
}