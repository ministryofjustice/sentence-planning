const winston = require('winston')
const config = require('../config')
const MDCAwareLogger = require('./mdc-aware-logger')

if (!config.loggingLevel) {
  config.loggingLevel = 'debug'
}
if (!config.env) {
  config.env = 'development'
}

const loggingTransports = []
const exceptionTransports = []
const notProd = config.env !== 'production'
const colors = {
  info: 'green',
  email: 'magenta',
  warn: 'yellow',
  error: 'red',
}

const consoleLog = new winston.transports.Console({
  json: notProd !== true,
  timestamp: true,
  colorize: true,
  level: config.loggingLevel.toLowerCase(),
})

loggingTransports.push(consoleLog)

exceptionTransports.push(
  new winston.transports.Console({
    json: notProd !== true,
    logstash: true,
    timestamp: true,
    colorize: true,
    stringify: function stringify(obj) {
      return JSON.stringify(obj)
    },
  })
)

const transports = {
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true,
}

if (notProd) {
  delete transports.exceptionHandlers
}

// eslint-disable-next-line new-cap
const logger = new winston.createLogger(transports)

winston.addColors(colors)

module.exports = new MDCAwareLogger(logger)
