const superagent = require('superagent')
const logger = require('../logging/logger')
const { getCorrelationId } = require('../utils/util')
const {
  apis: {
    sentencePlanning: { timeout, url },
  },
} = require('../config')

const createSentencePlan = (individualId, tokens) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  return postData(path, tokens)
}
const getSentencePlan = (sentencePlanId, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}`
  return getData(path, tokens)
}
const getOasysSentencePlan = (individualId, sentencePlanId, tokens) => {
  const path = `${url}/offenders/${individualId}/sentenceplans/${sentencePlanId}`
  return getData(path, tokens)
}
const getSentencePlanSummary = (individualId, tokens) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  return getData(path, tokens)
}

const getSentencePlanComments = (sentencePlanId, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/comments`
  return getData(path, tokens)
}

const setSentencePlanComment = (sentencePlanId, comment, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/comments`
  return putData(path, tokens, comment)
}

const getSentencePlanObjective = (sentencePlanId, objectiveId, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}`
  return getData(path, tokens)
}

const addSentencePlanObjective = (sentencePlanId, objective, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives`
  return postData(path, tokens, objective)
}

const updateSentencePlanObjectiveClose = (sentencePlanId, objectiveId, reason, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/close`
  return postData(path, tokens, reason)
}

const updateSentencePlanObjective = (sentencePlanId, objectiveId, objective, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}`
  return putData(path, tokens, objective)
}

const getSentencePlanNeeds = (sentencePlanId, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/needs`
  return getData(path, tokens)
}

const addSentencePlanObjectiveAction = (sentencePlanId, objectiveId, action, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/actions`
  return postData(path, tokens, action)
}

const getSentencePlanObjectiveAction = (sentencePlanId, objectiveId, actionId, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/actions/${actionId}`
  return getData(path, tokens)
}

const updateSentencePlanObjectiveAction = (sentencePlanId, objectiveId, actionId, action, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/actions/${actionId}`
  return putData(path, tokens, action)
}

const addSentencePlanObjectiveActionProgress = (sentencePlanId, objectiveId, actionId, progress, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/objectives/${objectiveId}/actions/${actionId}/progress`
  return postData(path, tokens, progress)
}

const startSentencePlan = (sentencePlanId, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/start`
  return postData(path, tokens)
}

const getInterventions = tokens => {
  const path = `${url}/interventions`
  return getData(path, tokens)
}

const getMotivations = tokens => {
  const path = `${url}/motivation`
  return getData(path, tokens)
}

const getSentencePlanMeetings = (id, tokens) => {
  const path = `${url}/offenders/${id}/reviews`
  return getData(path, tokens)
}

const getSentencePlanMeeting = (id, meetingId, tokens) => {
  const path = `${url}/offenders/${id}/reviews/${meetingId}`
  return getData(path, tokens)
}

const addSentencePlanMeeting = (sentencePlanId, meeting, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/reviews`
  return postData(path, tokens, meeting)
}

const endSentencePlan = (sentencePlanId, tokens) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/end`
  return postData(path, tokens)
}

const getData = async (path, { authorisationToken }) => {
  if (authorisationToken === undefined) {
    return logError(`No authorisation token found when calling SentencePlanningApi: ${path}`)
  }
  logger.info(`Calling SentencePlanningApi with GET: ${path}`)
  try {
    return await superagent
      .get(path)
      .auth(authorisationToken, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .timeout(timeout)
      .then(response => {
        return response.body
      })
  } catch (error) {
    return logError(error)
  }
}
const postData = async (path, { authorisationToken }, data) => {
  if (authorisationToken === undefined) {
    return logError(`No authorisation token found when calling SentencePlanningApi: ${path}`)
  }
  logger.info(`Calling SentencePlanningApi with POST: ${path}`)
  try {
    return await superagent
      .post(path)
      .send(data)
      .auth(authorisationToken, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .timeout(timeout)
      .then(response => {
        return response.body
      })
  } catch (error) {
    return logError(error)
  }
}

const putData = async (path, { authorisationToken }, data) => {
  if (authorisationToken === undefined) {
    return logError(`No authorisation token found when calling SentencePlanningApi: ${path}`)
  }
  logger.info(`Calling SentencePlanningApi with PUT: ${path}`)
  try {
    return await superagent
      .put(path)
      .send(data)
      .auth(authorisationToken, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
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
  getOasysSentencePlan,
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
  addSentencePlanObjectiveActionProgress,
  getInterventions,
  getMotivations,
  getSentencePlanMeetings,
  getSentencePlanMeeting,
  addSentencePlanMeeting,
  startSentencePlan,
  endSentencePlan,
  updateSentencePlanObjectiveClose,
}
