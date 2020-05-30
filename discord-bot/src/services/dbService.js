const db = require('../db/connection')

export const subscribeForTeam = (userId, teamname) => {
  console.log('On subscribe: userId: ', userId, 'Teamname: ', teamname)
  let team = db.get('teams').find({ name: teamname }).value()
  if (team) {
    console.log('has', 'team: ', team)

    if (team.subscribers.includes(userId))
      return
      
    team.subscribers.push(userId)

    db.get('teams')
      .find({ name: teamname })
      .assign({ ...team })
      .write()
  } else {
    console.log('dont has')
    db.get('teams')
      .push({
        name: teamname,
        subscribers: [userId]
      })
      .write()
  }
}

export const unsubscribeFromTeam = (userId, teamname) => {
  console.log('On unsubscribe: userId: ', userId, 'Teamname: ', teamname)
  let team = db.get('teams').find({ name: teamname }).value()
  if (team) {
    console.log('has', 'team: ', team)

    if (!team.subscribers.includes(userId))
      return
      
    team.subscribers = team.subscribers.filter(subscriber => subscriber !== userId)

    db.get('teams')
      .find({ name: teamname })
      .assign({ ...team })
      .write()
  } 
}

export const getSubscribedUsernamesByTeamname = (teamname) => {
  console.log('Teamname to find: ', teamname)
  let value = db.get('teams')
                .find({ name: teamname })
                .value() 
              || {}
  let userIds = value.subscribers || []
  // console.log('userIds: ', userIds, 'value: ', value)
  return userIds
}

export const getUserHistory = (userId) => {
  let value = db.get('user_messages_history')
                  .find({ userId: userId })
                  .value() || {}
  let history = value.history || []
  return history
}

export const addToUserHistory = (userId, matchId) => {
  try {
    let value = db.get('user_messages_history')
                  .find({ userId: userId })
                  .value()
    if (value) {
      console.log('has in history')
      value.history.push(matchId)
      db.get('user_messages_history')
        .filter({ userId: userId })
        .assign({ ...value })
        .write()
    } else {
      db.get('user_messages_history')
        .push({ 
          userId, history: [matchId]
        })
        .write()
    }
  } catch (err) {
    console.error(err)
  }
}

export const updateTimestamp = (newTimestamp) => {
  try {
    db.set('last_message_timestamp', newTimestamp)
      .write()
  } catch (err) {
    console.error(err)
  }
}

export const getLastNotificationTimestamp = () => {
  let timestamp = db.get('last_message_timestamp')
                    .value()
  return timestamp
}
