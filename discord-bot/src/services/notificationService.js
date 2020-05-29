import { getAllMatches } from './apiService'
import { 
  getUserHistory,
  addToUserHistory,
  getSubscribedUsernamesByTeamname
} from './dbService' 

export const NOTIFICATION_TIMEOUT_IN_MILISECONDS = 10 * 60 * 100

export const notificate = async (client) => {
  try {
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
          user.send('Match ' + JSON.stringify(match) + ' finished')
        }
      })

      let userIdsSubscribedForDire = getSubscribedUsernamesByTeamname(direName)
      userIdsSubscribedForDire.forEach(async userId => {
        let user = client.users.cache.get(userId) || await client.users.fetch(userId)
        let history = getUserHistory(userId)
        if (!history.includes(matchId)) {
          addToUserHistory(userId, matchId)
          user.send('Match ' + JSON.stringify(match) + ' finished')
        }
      })
    })
  } catch (err) {
    console.error(err)
  }
}

