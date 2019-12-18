const superagent = require('superagent')
const logger = require('../logging/logger')
const {
  apis: {
    sentencePlanning: { timeout, url },
  },
} = require('../config')

const createSentencePlan = async (individualId, token) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  return postData(path, token)
}
const getSentencePlan = async (sentencePlanId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}`
  return getData(path, token)
}
const getSentencePlanSummary = async (individualId, token) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  return getData(path, token)
}

const getSentencePlanComments = async (sentencePlanId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/comments`
  return getData(path, token)
}

const setSentencePlanComment = async (sentencePlanId, comment, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/comments`
  return putData(path, token, comment)
}

const getSentencePlanObjective = async (sentencePlanId, objectiveId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}`
  return getData(path, token)
}

const addSentencePlanObjective = async (sentencePlanId, objective, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives`
  return postData(path, token, objective)
}

const updateSentencePlanObjective = async (sentencePlanId, objectiveId, objective, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}`
  return putData(path, token, objective)
}

const getSentencePlanNeeds = async (sentencePlanId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/needs`
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

const putData = async (path, token, data) => {
  logger.info(`Calling SentencePlanningApi: ${path}`)
  try {
    return await superagent
      .put(path)
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

module.exports = {
  createSentencePlan,
  getSentencePlan,
  getSentencePlanSummary,
  getSentencePlanComments,
  setSentencePlanComment,
  getSentencePlanObjective,
  addSentencePlanObjective,
  updateSentencePlanObjective,
  getSentencePlanNeeds,
}
