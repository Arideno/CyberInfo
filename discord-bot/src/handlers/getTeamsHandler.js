import { reply } from './reply'
import { getAllTeams } from '../services/apiService'
import { convertTeamsListToEmbed } from '../toEmbedUtils'

export const getOnlyActiveTeams = (teams) => {
  let currentTimestamp = Date.now() / 1000
  let activeTeams = teams.filter(team => {
    let differenceInSeconds = currentTimestamp - team.last_match_time
    let differenceInDays = differenceInSeconds / (3600 * 24)
    return differenceInDays < 30
  })
  activeTeams.sort((team1, team2) => {
    let name1 = team1.name.toLowerCase()
    let name2 = team2.name.toLowerCase()
    if (name1 < name2) 
      return -1;
    if (name1 > name2) 
      return 1;
    return 0;
  })
  return activeTeams
}

export const getTeamsHandler = async (message) => {
  try {
    let teams = await getAllTeams()

    let activeTeams = getOnlyActiveTeams(teams)

    reply(null, message, convertTeamsListToEmbed(activeTeams))
  } catch (err) {
    reply(err, message, null)
  }
}