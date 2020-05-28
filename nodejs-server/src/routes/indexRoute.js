import matchesRoute from './matchesRoute'

const mountRoutes = app => {
    app.use('/api', matchesRoute)
    app.use((req, res, next) => {
      if (res.err) {
        res.status(err.status || 500).send({
          status: 'unsuccess',
          error: err.message || 'Internal Server Error',
        })
      } else {
        res.status(200).send({
          status: 'success',
          error: '',
          data: res.data
        })
      }
    })
}

export default mountRoutes