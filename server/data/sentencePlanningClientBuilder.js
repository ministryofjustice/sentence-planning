const superagent = require('superagent')
const Agent = require('agentkeepalive')
const { HttpsAgent } = require('agentkeepalive')
const logger = require('../../log')
const config = require('../config')

const timeoutSpec = {
  response: config.apis.sentencePlanning.timeout.response,
  deadline: config.apis.sentencePlanning.timeout.deadline,
}
const apiUrl = config.apis.sentencePlanning.url

const agentOptions = {
  maxSockets: config.apis.sentencePlanning.agent.maxSockets,
  maxFreeSockets: config.apis.sentencePlanning.agent.maxFreeSockets,
  freeSocketTimeout: config.apis.sentencePlanning.agent.freeSocketTimeout,
}

const keepaliveAgent = apiUrl.startsWith('https') ? new HttpsAgent(agentOptions) : new Agent(agentOptions)

module.exports = token => {
  const userGet = userGetBuilder(token)
  const userPost = userPostBuilder(token)
  return {
    async getSentencePlans(offenderId) {
      const path = `${apiUrl}/offender/${offenderId}/sentenceplans/`
      return userGet({ path })
    },
    async getSentencePlan(sentencePlanId) {
      const path = `${apiUrl}/sentenceplan/${sentencePlanId}`
      return userGet({ path })
    },
    async getSentencePlanNeeds(sentencePlanId) {
      const path = `${apiUrl}/sentenceplan/${sentencePlanId}/needs`
      return userGet({ path })
    },
    async getSentencePlanStep(sentencePlanId, stepId) {
      const path = `${apiUrl}/sentenceplan/${sentencePlanId}/steps/${stepId}`
      return userGet({ path })
    },
    async getLegacySentencePlan(offenderId, sentencePlanId) {
      const path = `${apiUrl}/offender/${offenderId}/sentenceplan/${sentencePlanId}`
      return userGet({ path })
    },
    async createSentencePlan(offenderId) {
      const path = `${apiUrl}/sentenceplan`
      return userPost({ path, data: { offenderId, offenderReferenceType: 'OASYS' } })
    },
    async updateServiceUserComments(sentencePlanId, serviceUserComment) {
      const path = `${apiUrl}/sentenceplan/${sentencePlanId}/serviceUserComments`
      return userPost({ path, data: serviceUserComment })
    },
  }
}
function userGetBuilder(token) {
  return async ({ path, query = '', headers = {}, responseType = '', raw = false } = {}) => {
    logger.info(`Get using sentence planning details: calling sentencePlanning API: ${path} ${query}`)
    try {
      const result = await superagent
        .get(path)
        .agent(keepaliveAgent)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .query(query)
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(timeoutSpec)

      return raw ? result : result.body
    } catch (error) {
      logger.warn(error, 'Error calling sentence-planning API')
      throw error
    }
  }
}

function userPostBuilder(token) {
  return async ({ path, headers = {}, responseType = '', data = {}, raw = false } = {}) => {
    logger.info(`Post using sentence planning details: calling sentencePlanning API: ${path}`)
    try {
      const result = await superagent
        .post(path)
        .send(data)
        .agent(keepaliveAgent)
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .auth(token, { type: 'bearer' })
        .set(headers)
        .responseType(responseType)
        .timeout(timeoutSpec)

      return raw ? result : result.body
    } catch (error) {
      logger.warn(error, 'Error posting to sentencePlanning API')
      throw error
    }
  }
}
