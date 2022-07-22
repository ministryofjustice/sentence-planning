require('dotenv').config()

const production = process.env.NODE_ENV === 'production'

function bool(v) {
  return v in ['true', '1', 'on', 'yes']
}

function get(name, fallback, options = {}) {
  const value = process.env[name]
  if (value) {
    const { parser } = options
    return parser ? parser(value) : value
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

module.exports = {
  apis: {
    sentencePlanning: {
      url: get('SENTENCEPLANNINGAPI_ENDPOINT_URL', 'http://localhost:18081', true),
      timeout: {
        response: get('SENTENCEPLANNINGAPI_ENDPOINT_TIMEOUT_RESPONSE', 10000, true),
        deadline: get('SENTENCEPLANNINGAPI_TIMEOUT_DEADLINE', 10000, true),
      },
      agent: {
        maxSockets: 100,
        maxFreeSockets: 10,
        freeSocketTimeout: 30000,
      },
    },
  },
  domain: `${get('INGRESS_URL', 'http://localhost:3000', true)}`,
  https: production,
  loggingLevel: get('LOGGING_LEVEL', 'info'),
  correlationHeader: get('CORRELATION_HEADER_NAME', 'x-request-id'),
  clsNamespace: get('CLS_NAMESPACE', 'uk.gov.digital.hmpps.sentence-planning'),
  applicationInsights: {
    instrumentationKey: get('APPINSIGHTS_INSTRUMENTATIONKEY', ''),
    disabled: get('APPINSIGHTS_DISABLE', false, { parser: bool }),
    internalLogging: get('APPINSIGHTS_LOGGING', false, { parser: bool }),
  },
}
