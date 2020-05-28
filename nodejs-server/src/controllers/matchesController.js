import fetch from 'node-fetch'

export const getAllMatches = async (req, res, next) => {
  try {
    // const url = `https://api.opendota.com/api/proMatches?api_key=${process.env.API_KEY}`
    const url = `https://api.opendota.com/api/proMatches`
    let response = await fetch(url, {
      method: 'GET'
    })

    console.log(response)

    let allMatches = await response.json()

    res.data = { allMatches }

  } catch (err) {
    console.error(err)
    next(err)
  } finally {
    next()
  }
}