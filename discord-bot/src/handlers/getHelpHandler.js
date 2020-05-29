import { reply } from './reply'

export const getHelpHandler = async (message) => {
  try {
    let helpInfo = `
                    /get_last_matches - get last matches
                    /help - get help
                    /get_all_teams - get all teams`

    reply(null, message, helpInfo)
  } catch (err) {
    reply(err, message, null)
  }
}