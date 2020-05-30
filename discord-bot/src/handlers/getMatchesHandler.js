import { getAllMatches } from '../services/apiService'
import { reply } from './reply'

import { convertRecentMatchesToEmbed } from '../toEmbedUtils'

export const getMatchesHandler = async (message) => {
  try {
    let matches = await getAllMatches()

    matches = matches.slice(0, 10)
    matches = matches.filter(match => match.radiant_name && match.dire_name)

    reply(null, message, convertRecentMatchesToEmbed(matches))
  } catch (err) {
    reply(err, message, null)
  }
}