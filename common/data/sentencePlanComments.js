const superagent = require('superagent')
const logger = require('../logging/logger')
const {
  apis: {
    sentencePlanning: { timeout, url },
  },
} = require('../config')

const getSentencePlanComments = async (sentencePlanId, token) => {
  const path = `${url}/sentenceplans/${sentencePlanId}/comments`
  logger.info(`getSentencePlanComments: calling SentencePlanningApi: ${path}`)
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

module.exports = { getSentencePlanComments }
