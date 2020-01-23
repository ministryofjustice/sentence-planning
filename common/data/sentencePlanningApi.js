const superagent = require('superagent')
const logger = require('../logging/logger')
const {
  apis: {
    sentencePlanning: { timeout, url },
  },
} = require('../config')

const createSentencePlan = (individualId, token) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  return postData(path, token)
}
const getSentencePlan = (sentencePlanId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}`
  return getData(path, token)
}
const getSentencePlanSummary = (individualId, token) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  return getData(path, token)
}

const getSentencePlanComments = (sentencePlanId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/comments`
  return getData(path, token)
}

const setSentencePlanComment = (sentencePlanId, comment, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/comments`
  return putData(path, token, comment)
}

const getSentencePlanObjective = (sentencePlanId, objectiveId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}`
  return getData(path, token)
}

const addSentencePlanObjective = (sentencePlanId, objective, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives`
  return postData(path, token, objective)
}

const updateSentencePlanObjective = (sentencePlanId, objectiveId, objective, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}`
  return putData(path, token, objective)
}

const getSentencePlanNeeds = (sentencePlanId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/needs`
  return getData(path, token)
}

const addSentencePlanObjectiveAction = (sentencePlanId, objectiveId, action, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/actions`
  return postData(path, token, action)
}

const getSentencePlanObjectiveAction = (sentencePlanId, objectiveId, actionId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/actions/${actionId}`
  return getData(path, token)
}

const updateSentencePlanObjectiveAction = (sentencePlanId, objectiveId, actionId, action, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/actions/${actionId}`
  return putData(path, token, action)
}

const getInterventions = token => {
  const path = `${url}/interventions`
  return getData(path, token)
}

const getMotivations = token => {
  const path = `${url}/motivation`
  return getData(path, token)
}

const getSentencePlanMeetings = (individualId, token) => {
  const path = `${url}/offenders/${individualId}/reviews`
  return getData(path, token)
}

const getSentencePlanMeeting = (individualId, meetingId, token) => {
  const path = `${url}/offenders/${individualId}/reviews/${meetingId}`
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
  addSentencePlanObjectiveAction,
  getSentencePlanObjectiveAction,
  updateSentencePlanObjectiveAction,
  getInterventions,
  getMotivations,
  getSentencePlanMeetings,
  getSentencePlanMeeting,
}
