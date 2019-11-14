const superagent = require('superagent')
const logger = require('../logging/logger')
const {
  apis: {
    sentencePlanning: { timeout, url },
  },
} = require('../config')

const getSentencePlanSummary = async (req, res, individualId) => {
  const path = `${url}/offenders/${individualId}/sentenceplans`
  logger.info(`getSentencePlanSummary: calling SentencePlanningApi: ${path}`)
  try {
    await superagent
      .get(path)
      .timeout(timeout)
      .then(({ body }) => {
        res.body = body
      })
  } catch (error) {
    logger.warn('Error calling sentence planning API')
    logger.warn(error)
    throw error
  }
}

module.exports = getSentencePlanSummary
