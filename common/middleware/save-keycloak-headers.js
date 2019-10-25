const saveKeycloakHeaders = (req, res, next) => {
  const keycloakHeaders = [
    'X-Auth-Name',
    'X-Auth-Username',
    'X-Auth-Given-Name',
    'X-Auth-Family-Name',
    'X-Auth-Email',
    'X-Auth-Locations',
  ]

  keycloakHeaders.forEach(headerName => {
    if (req.headers[headerName]) {
      req.session[headerName] = req.headers[headerName]
    }
  })

  next()
}

module.exports = { saveKeycloakHeaders }
