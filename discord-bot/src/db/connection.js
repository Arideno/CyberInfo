const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)

/**
 * DB contains map, which contains teams
 * map[username] - contains teams on which user subscribed
 */
// db.defaults({ teams: {} })
//   .write()

module.exports = db