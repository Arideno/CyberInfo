import { getAllMatches } from '../services/apiService'
import { reply } from './reply'

import { convertRecentMatchesToEmbed } from '../toEmbedUtils'

export const getMatchesHandler = async (message) => {
  try {
    let matches = await getAllMatches()

    matches = matches.slice(0, 3)

    reply(null, message, convertRecentMatchesToEmbed(matches))
  } catch (err) {
    reply(err, message, null)
  }
}