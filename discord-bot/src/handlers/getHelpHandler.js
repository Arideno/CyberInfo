import { reply } from './reply'

import { convertHelpToEmbed } from '../toEmbedUtils'

export const getHelpHandler = async (message) => {
  try {
    reply(null, message, convertHelpToEmbed())
  } catch (err) {
    reply(err, message, null)
  }
}