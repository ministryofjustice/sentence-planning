const logger = require('../../log.js')
const { isNilOrEmpty } = require('../utils/utils')

module.exports = function createSentencePlanningService(sentencePlanningClientBuilder) {
  const getSentencePlans = async (token, offenderId) => {
    try {
      const sentencePlanningClient = sentencePlanningClientBuilder(token)
      const result = await sentencePlanningClient.getSentencePlans(offenderId)

      if (isNilOrEmpty(result)) {
        logger.warn(`No sentence plans found for offenderId "${offenderId}"`)
        return []
      }

      return result
    } catch (error) {
      logger.error(error, 'Error during getSentencePlans')
      throw error
    }
  }
  const getSentencePlan = async (token, sentencePlanId) => {
    try {
      const sentencePlanningClient = sentencePlanningClientBuilder(token)
      const result = await sentencePlanningClient.getSentencePlan(sentencePlanId)

      if (isNilOrEmpty(result)) {
        logger.warn(`No sentence plan found for sentence plan id "${sentencePlanId}"`)
        return []
      }

      return result
    } catch (error) {
      logger.error(error, 'Error during getSentencePlan')
      throw error
    }
  }
  const getSentencePlanStep = async (token, sentencePlanId, stepId) => {
    try {
      const sentencePlanningClient = sentencePlanningClientBuilder(token)
      const result = await sentencePlanningClient.getSentencePlanStep(sentencePlanId, stepId)

      if (isNilOrEmpty(result)) {
        logger.warn(`No step found for sentence plan id "${sentencePlanId}" and step id "${stepId}"`)
        return []
      }

      return result
    } catch (error) {
      logger.error(error, 'Error during getSentencePlanStep')
      throw error
    }
  }
  const getSentencePlanNeeds = async (token, sentencePlanId) => {
    try {
      const sentencePlanningClient = sentencePlanningClientBuilder(token)
      const result = await sentencePlanningClient.getSentencePlanNeeds(sentencePlanId)

      if (isNilOrEmpty(result)) {
        logger.warn(`No needs found for sentence plan id "${sentencePlanId}"`)
        return []
      }

      return result
    } catch (error) {
      logger.error(error, 'Error during getSentencePlanNeeds')
      throw error
    }
  }

  return {
    getSentencePlans,
    getSentencePlan,
    getSentencePlanStep,
    getSentencePlanNeeds,
  }
}
