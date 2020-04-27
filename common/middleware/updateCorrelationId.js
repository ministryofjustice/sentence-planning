// checks if there is a keycloak request id in the headers and uses that for correlation ID if found
const { getNamespace } = require('cls-hooked')
const { clsNamespace } = require('../config')
const { updateMDC } = require('../utils/util')

const updateCorrelationId = ({ headers: { 'x-request-id': correlationId } }, res, next) => {
  if (correlationId) {
    const mdcNamespace = getNamespace(clsNamespace)
    const mdc = mdcNamespace.get('MDC')
    mdc.correlationId = correlationId
    updateMDC('MDC', mdc)
  }

  next()
}

module.exports = { updateCorrelationId }
