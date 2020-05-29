import { getAllMatches } from '../services/apiService'
import { reply } from './reply'

const getReadableInfo = (matches = []) => {
  let info = '\n'
  for (let match of matches) {
    info +=  `Tournament: ${match.league_name} \n`
    info +=  `Radiant: ${match.radiant_name} (${match.radiant_score}) ` + (match.radiant_win === true ? 'win' : '') + '\n'
    info +=  `Dire: ${match.dire_name} (${match.dire_score}) ` + (match.radiant_win === false ? 'win' : '') + '\n \n'
  }
  return info
}

export const getMatchesHandler = async (message) => {
  try {
    let matches = await getAllMatches()

    matches = matches.slice(0, 3)
    let matchesInfo = getReadableInfo(matches)

    reply(null, message, matchesInfo)
  } catch (err) {
    reply(err, message, null)
  }
}