const logger = require('../../log.js')
const { isNilOrEmpty } = require('../utils/utils')

module.exports = function createSentencePlanningService(sentencePlanningClientBuilder) {
  const getSentencePlans = async (token, offenderId) => {
    try {
      const sentencePlanningClient = sentencePlanningClientBuilder(token)
      const result = await sentencePlanningClient.getSentencePlans(offenderId)

      if (isNilOrEmpty(result)) {
        logger.warn(`No sentence plans found for offenderId=${offenderId}`)
        return []
      }

      return result
    } catch (error) {
      logger.error(error, 'Error during getSentencePlans')
      throw error
    }
  }

  return {
    getSentencePlans,
  }
}
