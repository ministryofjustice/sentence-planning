const superagent = require('superagent')
const logger = require('../logging/logger')
const {
  apis: {
    sentencePlanning: { timeout, url },
  },
} = require('../config')

const getSentencePlanSummary = async (individualId, token) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  logger.info(`getSentencePlanSummary: calling SentencePlanningApi: ${path}`)
  try {
    return await superagent
      .get(path)
      .auth(token, { type: 'bearer' })
      .timeout(timeout)
      .then(response => {
        return response.body
      })
  } catch (error) {
    logger.warn('Error calling sentence planning API')
    logger.warn(error)
    throw error
  }
}

module.exports = getSentencePlanSummary
