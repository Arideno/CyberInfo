import { getAllMatches } from '../services/apiService'
import { reply } from './reply'

const getReadableInfo = (matches = []) => {
  let data = ['']
  for (let match of matches) {
    data.push( `Tournament: ${match.league_name}` )
    data.push( `Radiant: ${match.radiant_name} (${match.radiant_score}) ` + (match.radiant_win === true ? 'win' : '') )
    data.push( `Dire: ${match.dire_name} (${match.dire_score}) ` + (match.radiant_win === false ? 'win' : '') )
    data.push('')
  }
  return data
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