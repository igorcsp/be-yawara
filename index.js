const winston = require('winston')
const express = require('express')
const config = require('config')
const app = express()

require('./startup/logging')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()


const port = config.get('app.port')
const server = app.listen(port, () => { winston.info(`Listening on port ${port}`) })
winston.info(`Ambiente atual: ${process.env.NODE_ENV}`)
winston.info(`db_uri: ${config.get("db.uri")}`)


module.exports = server
