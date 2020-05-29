import { reply } from './reply'

export const getHelpHandler = async (message) => {
  try {
    let data = ['']
    data.push ('!help   ---   get help')
    data.push ('!get_last_matches   ---   get last Dota2 PRO matches')
    data.push ('!get_all_teams   ---   get active Dota2 PRO teams')

    data.push ('!subscribe {team_name}   ---   subscribe to matches of team_name')
    data.push ('--Example: !subscribe Natus Vincere')

    data.push ('!subscribe_for_all   ---   subscribe to matches of all teams')

    data.push ('!unsubscribe {team_name}   ---   unsubscribe of matches of team_name')
    data.push ('--Example: !unsubscribe Natus Vincere')

    data.push ('!get_subs_by_teamname {team_name}   ---   get list of subscribers of team_name')
    data.push ('--Example: !get_subs_by_teamname Natus Vincere')
    reply(null, message, data)
  } catch (err) {
    reply(err, message, null)
  }
}