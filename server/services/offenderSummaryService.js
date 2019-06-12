const { getOffenderData, getSentencePlan } = require('../data/oasysClient')
const logger = require('../../log.js')

const offenderSummaryData = async (idType, id, callback) => {
  logger.info(`Calling getOffenderData(${idType}, ${id})`)
  try {
    const result = await getOffenderData(idType, id)

    try {
      if (result.oasysOffenderId) {
        result.sentencePlan = await getSentencePlan('oasysOffenderId', result.oasysOffenderId)
      }
    } catch (error) {
      logger.info('No sentence plan returned.')
      logger.info(error)
    }
    callback(null, result)
  } catch (error) {
    callback(error)
  }
}

module.exports = { offenderSummaryData }
