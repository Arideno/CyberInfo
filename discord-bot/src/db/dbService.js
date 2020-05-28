const db = require('./connection')
const uuidv4 = require('uuid')

/**
 * 
 * @param {String} name 
 */
export const addUser = (name) => {
  db.get('users')
    .push({
      name,
      id: uuidv4()
    })
    .write()
}

/**
 * 
 * @param {String} name 
 */
export const findUserByName = (name) => {
  let users = db.get('users')
  for (let user of users) {
    if (user.name === name) 
      return user
  }
}