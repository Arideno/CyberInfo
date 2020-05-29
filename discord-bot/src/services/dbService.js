import { sortBy } from '../db/connection'

const db = require('../db/connection')
const uuidv4 = require('uuid')

// /**
//  * 
//  * @param {String} name 
//  */
// export const addUser = (name) => {
//   db.get('users')
//     .push({
//       name,
//       id: uuidv4()
//     })
//     .write()
// }

// /**
//  * 
//  * @param {String} name 
//  */
// export const findUserByName = (name) => {
//   let users = db.get('users')
//   for (let user of users) {
//     if (user.name === name) 
//       return user
//   }
// }

export const subscribeForTeam = (username, teamname) => {
  if (db.has(teamname)) {
    db.get(teamname).push(username)
  } else {
    db.set(teamname, [username])
  }
}

export const getSubscribedUsernamesByTeamname = (teamname) => {
  let usernames = gb.get(teamname) || []
  return usernames
}
