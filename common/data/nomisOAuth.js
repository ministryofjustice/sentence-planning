const superagent = require('superagent')
const Agent = require('agentkeepalive')
const { HttpsAgent } = require('agentkeepalive')
const logger = require('../logging/logger')
const config = require('../config')

const oauthUrl = `${config.apis.oauth2.url}/oauth/token`
const timeoutSpec = {
  response: config.apis.oauth2.timeout.response,
  deadline: config.apis.oauth2.timeout.deadline,
}

const agentOptions = {
  maxSockets: config.apis.oauth2.agent.maxSockets,
  maxFreeSockets: config.apis.oauth2.agent.maxFreeSockets,
  freeSocketTimeout: config.apis.oauth2.agent.freeSocketTimeout,
}
const keepaliveAgent = oauthUrl.startsWith('https') ? new HttpsAgent(agentOptions) : new Agent(agentOptions)

const getOauthToken = () => {
  const clientId = config.apis.oauth2.apiClientId
  const clientSecret = config.apis.oauth2.apiClientSecret
  return superagent
    .post(`${config.apis.oauth2.url}/oauth/token`)
    .auth(clientId, clientSecret)
    .set('content-type', 'application/x-www-form-urlencoded')
    .agent(keepaliveAgent)
    .retry(2, err => {
      if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
      return undefined // retry handler only for logging retries, not to influence retry logic
    })
    .send('grant_type=client_credentials')
    .timeout(timeoutSpec)
}

const getToken = async () => {
  try {
    const response = await getOauthToken()
    const {
      body: { access_token: accessToken },
    } = response
    return accessToken
  } catch (error) {
    logger.warn(`Could not retrive token; ${error}`)
    return null
  }
}

module.exports = getToken
