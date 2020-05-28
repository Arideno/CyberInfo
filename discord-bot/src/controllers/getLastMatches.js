import { getAllMatches } from '../services/apiService'

const getReadableInfo = (matches = []) => {
  let info = '\n'
  for (let match of matches) {
    info +=  `Tournament: ${match.league_name} \n`
    info +=  `Radiant: ${match.radiant_name} (${match.radiant_score}) ` + (match.radiant_win === true ? 'win' : '') + '\n'
    info +=  `Dire: ${match.dire_name} (${match.dire_score}) ` + (match.radiant_win === false ? 'win' : '') + '\n'
  }
  return info
}

export const processGetMatches = async (message) => {
  let matches = await getAllMatches()

  matches = matches.slice(0, 3)
  let matchesInfo = getReadableInfo(matches)

  message.reply(matchesInfo)
}