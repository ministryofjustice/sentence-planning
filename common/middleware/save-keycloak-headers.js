const logger = require('../logging/logger')

const keycloakHeaders = [
  'x-auth-name',
  'x-auth-username',
  'x-auth-given-name',
  'x-auth-family-name',
  'x-auth-email',
  'x-auth-locations',
]

const saveKeycloakHeaders = (req, res, next) => {
  logger.debug(`request headers: ${JSON.stringify(req.headers)}`)

  keycloakHeaders.forEach(headerName => {
    const lcHeaderName = headerName.toLowerCase()
    if (req.headers[lcHeaderName]) {
      req.session[headerName] = req.headers[lcHeaderName]
    }
  })

  next()
}

module.exports = { saveKeycloakHeaders, keycloakHeaders }
