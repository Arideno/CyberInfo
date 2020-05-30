import { value } from './db/connection'

const Discord = require('discord.js')

export const convertMatchResultsToEmbed = (match = {}, matchData = {}) => {
  let { players = [] } = matchData

  let radiantPlayers = players.filter(player => {
    return player.isRadiant
  })
  radiantPlayers.sort((player1, player2) => player1.lane_role - player2.lane_role)
  let direPlayers = players.filter(player => {
    return !player.isRadiant
  })

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
                    name: ' --  ', 
                    value: '  --  ', 
                    inline: true 
                  },
                  { 
                    name: 'Dire', 
                    value: match.dire_name + (match.radiant_win === false ? ' 🏆' : ''), 
                    inline: true 
                  }
                )
                .setTimestamp()
  
  for (let i = 0; i < 5; i++) {
    let radiantPlayer = radiantPlayers[i]
    let direPlayer = direPlayers[i]
    embed.addFields(
      {
        name: `${radiantPlayer.name || radiantPlayer.personaname} (${radiantPlayer.total_gold})`,
        value: `${radiantPlayer.kills} / ${radiantPlayer.deaths} / ${radiantPlayer.assists}`,
        inline: true
      },
      { 
        name: ' --  ', 
        value: '  --  ', 
        inline: true 
      },
      {
        name: `${direPlayer.name || direPlayer.personaname} (${direPlayer.total_gold})`,
        value: `${direPlayer.kills} / ${direPlayer.deaths} / ${direPlayer.assists}`,
        inline: true
      }
    )
  }

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
  for (let match of matches) {
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
  }
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
                        name: '\u200b',
                        value: '\u200b',
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
                        inline: false
                      },
                      { 
                        name: '`!unsubscribe {team_name}`', 
                        value: '`unsubscribe of matches of team_nam`',
                        inline: true
                      },
                      {
                        name: '\u200b',
                        value: '\u200b',
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
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                      },
                      { 
                        name: '`Example:`', 
                        value: '`!get_subs_by_teamname Natus Vincere`',
                        inline: true
                      },
                    )
  return embed
}