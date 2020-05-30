import { 
  getAllMatches,
  getMatchDataById 
} from './apiService'
import { 
  getUserHistory,
  addToUserHistory,
  getSubscribedUsernamesByTeamname,
  getLastNotificationTimestamp,
  updateTimestamp
} from './dbService' 

export const NOTIFICATION_TIMEOUT_IN_MILISECONDS = 10 * 60 * 100

import { convertMatchResultsToEmbed } from '../toEmbedUtils'

export const notificate = async (client) => {
  try {
    let matches = await getAllMatches()
    let lastNotificationTimestamp = getLastNotificationTimestamp()
    // lastNotificationTimestamp = 0 //TODO: REMOVE
    let currentTimestamp = Date.now() / 1000

    matches = matches.filter(match => (match.start_time + match.duration + 1) > lastNotificationTimestamp) || []
    matches = matches.slice(0, 50)

    let fetchingApiCalls = []

    for (let match of matches) {
      fetchingApiCalls.push(getMatchDataById(match.match_id))
    }

    let results = await Promise.all(fetchingApiCalls)

    for (let result of results) {
      let { match_id } = result
      let match = matches.find(match => match.match_id === match_id)
      match.match_data = result
      // let matchData = await getMatchDataById(match.match_id)
      // match.match_data = matchData
    }
    
    let isNotified = false
    for (let match of matches) {
      // console.log('match info:', match.radiant_name, match.dire_name, match.match_data)
      if (!match.radiant_name || !match.dire_name)
        continue

      let radiantName = match.radiant_name.replace(/\s/g, '')
      let direName = match.dire_name.replace(/\s/g, '')
      let matchId = match.match_id

      let userIdsSubscribedForRadiant = getSubscribedUsernamesByTeamname(radiantName)
      userIdsSubscribedForRadiant.forEach(async userId => {
        let user = client.users.cache.get(userId) || await client.users.fetch(userId)
        let history = getUserHistory(userId)
        if (!history.includes(matchId)) {
          console.log('Must be sended')
          user.send(convertMatchResultsToEmbed(match, match.match_data))
          addToUserHistory(userId, matchId)
          isNotified = true
        }
      })

      let userIdsSubscribedForDire = getSubscribedUsernamesByTeamname(direName)
      userIdsSubscribedForDire.forEach(async userId => {
        let user = client.users.cache.get(userId) || await client.users.fetch(userId)
        let history = getUserHistory(userId)
        if (!history.includes(matchId)) {
          console.log('Must be sended2')
          user.send(convertMatchResultsToEmbed(match, match.match_data))
          addToUserHistory(userId, matchId)
          isNotified = true
        }
      })
    }

    if (isNotified)
      updateTimestamp(currentTimestamp)
  } catch (err) {
    console.error(err)
    throw err
  }
}

