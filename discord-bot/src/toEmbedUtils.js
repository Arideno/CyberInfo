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
  return embed
}

export const convertUsernamesToEmbed = (usernames = []) => {

  let description = ''
  if (usernames.length > 0) {
    description = '`' + usernames.join('`     `') + '`'
  } else {
    description = '`No one following this team`'
  }

  let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Usernames')
                .setDescription(description)
  return embed
}

export const convertRecentMatchesToEmbed = (matches = []) => {
  let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Recent matches')
  for (let match of matches) {
    if (!match.radiant_name || !match.dire_name)
      continue

    console.log(match.radiant_name, match.dire_name)

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

const getWinner = (isRadiant, radiantWin) => {
  if (isRadiant && radiantWin === true)
    return true
  if (!isRadiant && radiantWin === false)
    return true
  return false
}

export const convertTeamInfoToEmbed = (teamInfo) => {

  let { 
    name: teamname, 
    matches,
    logo_url,
    wins,
    losses
  } = teamInfo

  let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Recent matches')
                .setThumbnail(logo_url)
                .setDescription(
                  `wins: ${wins}
                   losses: ${losses}`
                )
  for (let match of matches) {
    let { radiant: isRadiant } = match
    embed.addFields(
      { 
        name: 'Tournament', 
        value: match.league_name,
        inline: true 
      },
      { 
        name: isRadiant ? 'Radiant' : 'Dire', 
        value: teamname + (getWinner(isRadiant, match.radiant_win) ? ' 🏆' : ''),
        inline: true 
      },
      { 
        name: !isRadiant ? 'Radiant' : 'Dire', 
        value: match.opposing_team_name + (getWinner(!isRadiant, match.radiant_win) ? ' 🏆' : ''), 
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


                      // { 
                      //   name: '`!get_subs_by_teamname {team_name}`', 
                      //   value: '`get list of subscribers of team_name`',
                      //   inline: true
                      // },
                      // {
                      //   name: '\u200b',
                      //   value: '\u200b',
                      //   inline: true
                      // },
                      // { 
                      //   name: '`Example:`', 
                      //   value: '`!get_subs_by_teamname Natus Vincere`',
                      //   inline: true
                      // },


                      { 
                        name: '`!get_team_info {team_name}`', 
                        value: '`get short info of team_name`',
                        inline: true
                      },
                      {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                      },
                      { 
                        name: '`Example:`', 
                        value: '`!get_team_info Natus Vincere`',
                        inline: true
                      },
                    )
  return embed
}