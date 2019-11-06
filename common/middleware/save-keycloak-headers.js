const logger = require('../logging/logger')

const keycloakHeaders = [
  'X-Auth-Name',
  'X-Auth-Username',
  'X-Auth-Given-Name',
  'X-Auth-Family-Name',
  'X-Auth-Email',
  'X-Auth-Locations',
]

const saveKeycloakHeaders = (req, res, next) => {
  logger.info('in saveKeycloakHeaders')
  logger.info(JSON.stringify(req.headers))

  keycloakHeaders.forEach(headerName => {
    if (req.headers[headerName]) {
      req.session[headerName] = req.headers[headerName]
    }
  })

  next()
}

module.exports = { saveKeycloakHeaders, keycloakHeaders }
