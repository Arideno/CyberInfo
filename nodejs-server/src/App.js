require('dotenv').config()

/**
 * Set up
 */
import express from 'express'

const app = express();

/**
 * Logging
 */
import morgan from 'morgan'

app.use(morgan('dev'))


// /**
//  * Cors
//  */
// const cors = require('cors')

// app.use(cors(config.corsOptions))


// /**
//  * Cookies
//  */
// const cookierParser = require('cookie-parser')

// app.use(cookierParser(config.cookieSecret))

/**
 * Body parser
 */
import bodyParser from 'body-parser'

app.use(bodyParser.json())


/**
 * Routes
 */
import mountRoutes from './routes/indexRoute'

mountRoutes(app)

// /**
//  * Static
//  */
// const path = require('path')

// app.use(express.static(path.join(__dirname, '../images')))
/*app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})*/

/**
 * Go live
 */
//let http = require('http');
//http.createServer(app).listen(80);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server started and working on port ${process.env.APP_PORT}`)
});