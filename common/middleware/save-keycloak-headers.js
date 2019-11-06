const logger = require('../logging/logger')

const keycloakHeaders = ['x-auth-email', 'x-auth-groups', 'x-auth-roles', 'x-auth-userid', 'x-auth-username']

const saveKeycloakHeaders = (req, res, next) => {
  logger.debug(`request headers: ${JSON.stringify(req.headers)}`)

  keycloakHeaders.forEach(headerName => {
    if (req.headers[headerName]) {
      req.session[headerName] = req.headers[headerName]
    }
  })

  next()
}

module.exports = { saveKeycloakHeaders, keycloakHeaders }
