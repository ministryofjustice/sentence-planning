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
  sessionSecret: get('SESSION_SECRET', 'app-insecure-default-session', { requireInProduction: true }),
  apis: {
    oauth2: {
      url: get('NOMIS_AUTH_URL', 'http://oauth:9090/auth', true),
      externalUrl: get('NOMIS_AUTH_EXTERNAL_URL', get('NOMIS_AUTH_URL', 'http://oauth:9090/auth'), true),
      timeout: {
        response: get('AUTH_ENDPOINT_TIMEOUT_RESPONSE', 10000, true),
        deadline: get('AUTH_ENDPOINT_TIMEOUT_DEADLINE', 10000, true),
      },
      agent: {
        maxSockets: 100,
        maxFreeSockets: 10,
        freeSocketTimeout: 30000,
      },
      apiClientId: get('API_CLIENT_ID', 'sentence-plan-api-client', true),
      apiClientSecret: get('API_CLIENT_CREDENTIALS_SECRET', 'clientsecret'),
    },
    elite2: {
      url: get('ELITE2API_ENDPOINT_URL', 'http://localhost:8085', true),
      timeout: {
        response: get('ELITE2API_ENDPOINT_TIMEOUT_RESPONSE', 10000, true),
        deadline: get('ELITE2API_ENDPOINT_TIMEOUT_DEADLINE', 10000, true),
      },
      agent: {
        maxSockets: 100,
        maxFreeSockets: 10,
        freeSocketTimeout: 30000,
      },
    },
    offenderAssessment: {
      url: get('OASYSAPI_ENDPOINT_URL', 'http://localhost:8081', true),
      timeout: {
        response: get('OASYSAPI_ENDPOINT_TIMEOUT_RESPONSE', 30000, true),
        deadline: get('OASYSAPI_ENDPOINT_TIMEOUT_DEADLINE', 35000, true),
      },
      agent: {
        maxSockets: 100,
        maxFreeSockets: 10,
        freeSocketTimeout: 30000,
      },
    },
    sentencePlanning: {
      url: get('SENTENCEPLANNINGAPI_ENDPOINT_URL', 'http://localhost:8080', true),
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
  applicationInsights: {
    instrumentationKey: get('APPINSIGHTS_INSTRUMENTATIONKEY', ''),
    disabled: get('APPINSIGHTS_DISABLE', false, { parser: bool }),
    internalLogging: get('APPINSIGHTS_LOGGING', false, { parser: bool }),
  },
}
