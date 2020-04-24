// checks if there is a keycloak request id in the headers and uses that for correlation ID if found
const cls = require('cls-hooked')
const { clsNamespace } = require('../config')
const { updateMDC } = require('../utils/util')

const updateCorrelationId = (req, res, next) => {
  const {
    headers: { 'x-request-id': correlationId },
  } = req

  if (correlationId) {
    const mdcNamespace = cls.getNamespace(clsNamespace)
    const mdc = mdcNamespace.get('MDC')
    mdc.correlationId = correlationId
    updateMDC('MDC', mdc)
  }

  next()
}

module.exports = { updateCorrelationId }
