const { getOffenderData, getSentencePlan } = require('../data/oasysClient')
const logger = require('../../log.js')

const offenderSummaryData = async (crn, callback) => {
  logger.info(`Calling getOffenderData(${crn})`)
  try {
    const result = await getOffenderData(crn)

    try {
      if (result.identifiers.nomisId) {
        result.sentencePlan = await getSentencePlan('nomisId', result.identifiers.nomisId)
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
