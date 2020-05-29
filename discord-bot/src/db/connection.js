const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)

/**
 * DB contains 2 arrays. 
 * Every element of teams: 
 * {
 *  name - String, team name
 *  subscribers - Array<String>, subs of team
 * }
 * user_messages_history contains Array<Integer> - id's of matches which has already been notified 
 * {
 *  userId - Integer, id of user
 *  history - Arrat<Integer>, id's of matches
 * }
 */
db.defaults({ teams: [], user_messages_history: [] })
  .write()

module.exports = db