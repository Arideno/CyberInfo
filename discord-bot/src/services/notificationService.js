import { getAllMatches } from './apiService'
import { 
  getUserHistory,
  addToUserHistory,
  getSubscribedUsernamesByTeamname
} from './dbService' 

export const NOTIFICATION_TIMEOUT_IN_MILISECONDS = 10 * 60 * 10

import { convertMatchResultsToEmbed } from '../toEmbedUtils'

export const notificate = async (client) => {
  try {
    console.log(client.users.cache)
    let __user = client.users.cache.get("490210123810340875") || await client.users.fetch("490210123810340875")
    __user.send(convertMatchResultsToEmbed({"match_id":5421662266,"duration":1645,"start_time":1590777662,"radiant_team_id":7819701,"radiant_name":"VP.Prodigy","dire_team_id":7118032,"dire_name":"Winstrike Team","leagueid":12027,"league_name":"ESL One Birmingham 2020 Online powered by Intel","series_id":449948,"series_type":1,"radiant_score":26,"dire_score":16,"radiant_win":true}))
    return
    let matches = await getAllMatches()
    let lastFetchingTimestamp = Date.now() / 1000 - NOTIFICATION_TIMEOUT_IN_MILISECONDS

    // console.log(matches, matches[0].start_time - lastFetchingTimestamp)
    matches = matches.filter(match => match.start_time > lastFetchingTimestamp)
    
    matches.forEach(match => {
      let radiantName = match.radiant_name.replace(/\s/g, '')
      let direName = match.dire_name.replace(/\s/g, '')
      let matchId = match.match_id

      let userIdsSubscribedForRadiant = getSubscribedUsernamesByTeamname(radiantName)
      userIdsSubscribedForRadiant.forEach(async userId => {
        let user = client.users.cache.get(userId) || await client.users.fetch(userId)
        let history = getUserHistory(userId)
        if (!history.includes(matchId)) {
          addToUserHistory(userId, matchId)
          user.send(getReadableInfo(match))
        }
      })

      let userIdsSubscribedForDire = getSubscribedUsernamesByTeamname(direName)
      userIdsSubscribedForDire.forEach(async userId => {
        let user = client.users.cache.get(userId) || await client.users.fetch(userId)
        let history = getUserHistory(userId)
        if (!history.includes(matchId)) {
          addToUserHistory(userId, matchId)
          user.send(getReadableInfo(match))
        }
      })
    })
  } catch (err) {
    console.error(err)
  }
}

