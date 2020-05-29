const Discord = require('discord.js')

export const convertMatchResultsToEmbed = (match = {}) => {
  let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Match finished')
                .setDescription(`Tournament: ${match.league_name}`)
                .addFields(
                  { 
                    name: 'Radiant', 
                    value: match.radiant_name + (match.radiant_win === true ? ' 🏆' : ''),
                    inline: true 
                  },
                  { 
                    name: 'Dire', 
                    value: match.dire_name + (match.radiant_win === false ? ' 🏆' : ''), 
                    inline: true 
                  },
                )
                .setTimestamp()
  return embed
}

export const convertTeamsListToEmbed = (teams = []) => {
  let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Teams')
                .setDescription('`' + teams.map(team => team.name).join('`     `') + '`')
  // embed.addFields({
  //   name: 'Teams',
  //   value: '`' + teams.map(team => team.name).join('`     `') + '`',
  //   inline: true
  // })
  // teams.forEach(team => {
    
  // })
  return embed
}

export const convertUsernamesToEmbed = (usernames = []) => {
  let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Usernames')
                .setDescription('`' + usernames.join('`     `') + '`')
  // usernames.forEach(username => {
  //   embed.addFields({
  //     name: 'Usernames',
  //     value: username
  //   })
  // })
  return embed
}

export const convertRecentMatchesToEmbed = (matches = []) => {
  let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Recent matches')
  matches.forEach(match => {
    embed.addFields(
      { 
        name: 'Tournament', 
        value: match.league_name,
        inline: true 
      },
      { 
        name: 'Radiant', 
        value: match.radiant_name + (match.radiant_win === true ? ' 🏆' : ''),
        inline: true 
      },
      { 
        name: 'Dire', 
        value: match.dire_name + (match.radiant_win === false ? ' 🏆' : ''), 
        inline: true 
      },
    )
  })
  return embed
}

export const convertHelpToEmbed = () => {
  let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Help')
                    .addFields(
                      { 
                        name: '`!help`', 
                        value: '`get help`',
                      },
                      { 
                        name: '`!get_last_matches`', 
                        value: '`get last Dota2 PRO matches`',
                      },
                      { 
                        name: '`!get_all_teams`', 
                        value: '`get active Dota2 PRO teams`',
                      },
                      { 
                        name: '`!subscribe {team_name}`', 
                        value: '`subscribe to matches of team_name`',
                        inline: true
                      },
                      { 
                        name: '`Example:`', 
                        value: '`!subscribe Natus Vincere`',
                        inline: true
                      },
                      { 
                        name: '`!subscribe_for_all`', 
                        value: '`subscribe to matches of all teams`',
                      },
                      { 
                        name: '`!unsubscribe {team_name}`', 
                        value: '`unsubscribe of matches of team_nam`',
                        inline: true
                      },
                      { 
                        name: '`Example:`', 
                        value: '`!unsubscribe Natus Vincere`',
                        inline: true
                      },
                      { 
                        name: '`!get_subs_by_teamname {team_name}`', 
                        value: '`get list of subscribers of team_name`',
                        inline: true
                      },
                      { 
                        name: '`Example:`', 
                        value: '`!get_subs_by_teamname Natus Vincere`',
                        inline: true
                      },
                    )
  return embed
  // let data = ['']
  //   data.push ('!help   ---   get help')
  //   data.push ('!get_last_matches   ---   get last Dota2 PRO matches')
  //   data.push ('!get_all_teams   ---   get active Dota2 PRO teams')

  //   data.push ('!subscribe {team_name}   ---   subscribe to matches of team_name')
  //   data.push ('--Example: !subscribe Natus Vincere')

  //   data.push ('!subscribe_for_all   ---   subscribe to matches of all teams')

  //   data.push ('!unsubscribe {team_name}   ---   unsubscribe of matches of team_name')
  //   data.push ('--Example: !unsubscribe Natus Vincere')

  //   data.push ('!get_subs_by_teamname {team_name}   ---   get list of subscribers of team_name')
  //   data.push ('--Example: !get_subs_by_teamname Natus Vincere')
}

// const getReadableInfo = (matches = []) => {
//   let data = ['']
//   for (let match of matches) {
//     data.push( `Tournament: ${match.league_name}` )
//     data.push( `Radiant: ${match.radiant_name} (${match.radiant_score}) ` + (match.radiant_win === true ? 'win' : '') )
//     data.push( `Dire: ${match.dire_name} (${match.dire_score}) ` + (match.radiant_win === false ? 'win' : '') )
//     data.push('')
//   }
//   return data
// }

// const getReadableInfo = (usernames = []) => {
//   let data = ['']
//   for (let username of usernames) {
//     data.push( `${username}` )
//   }
//   return data
// }

// const getReadableInfo = (teams = []) => {
//   let info = '\n'
//   for (let team of teams) {
//     info += `${team.name}\n`
//   }
//   info += `Command: /subscribe_{team_name} \nExample: /subscribe_Natus Vincere`
//   return info
// }
