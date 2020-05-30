const axios = require('axios').default

export const getAllMatches = async () => {
  try {
    const url = 'https://api.opendota.com/api/proMatches'
    console.log(`API call for ${url} started`)
    let response = await axios({
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      url,
    })

    let { data } = response

    return data

  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getAllTeams = async () => {
  try {
    const url = 'https://api.opendota.com/api/teams'
    console.log(`API call for ${url} started`)
    let response = await axios({
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      url,
    })

    let { data } = response

    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getMatchDataById = async (id) => {
  try {
    const url = `https://api.opendota.com/api/matches/${id}`
    console.log(`API call for ${url} started`)
    let response = await axios({
      method: 'GET',
      url,
    })

    let { data } = response

    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}