const axios = require('axios').default

export const getAllMatches = async () => {
  try {
    const url = 'https://api.opendota.com/api/proMatches'
    let response = await axios({
      method: 'GET',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
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
    let response = await axios({
      method: 'GET',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      url,
    })

    let { data } = response

    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}