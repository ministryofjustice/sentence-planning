const superagent = require('superagent')
const logger = require('../logging/logger')
const {
  apis: {
    sentencePlanning: { timeout, url },
  },
} = require('../config')

const createSentencePlan = async (offenderId, token) => {
  const path = `${url}/sentenceplan`
  return postData(path, token, { offenderId, offenderReferenceType: 'OASYS' })
}
const getSentencePlanSummary = async (individualId, token) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  return getData(path, token)
}

const getData = async (path, token) => {
  logger.info(`Calling SentencePlanningApi: ${path}`)
  try {
    return await superagent
      .get(path)
      .auth(token, { type: 'bearer' })
      .timeout(timeout)
      .then(response => {
        return response.body
      })
  } catch (error) {
    return logError(error)
  }
}
const postData = async (path, token, data) => {
  logger.info(`Calling SentencePlanningApi: ${path}`)
  try {
    return await superagent
      .post(path)
      .send(data)
      .auth(token, { type: 'bearer' })
      .timeout(timeout)
      .then(response => {
        return response.body
      })
  } catch (error) {
    return logError(error)
  }
}

const logError = error => {
  logger.warn('Error calling sentence planning API')
  logger.warn(error)
  throw error
}

module.exports = { createSentencePlan, getSentencePlanSummary }