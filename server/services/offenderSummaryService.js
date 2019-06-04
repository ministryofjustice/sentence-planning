const { getOffenderData } = require('../data/oasysClient')
const logger = require('../../log.js')

const offenderSummaryData = async (crn, callback) => {
  logger.info(`Calling getOffenderData(${crn})`)
  try {
    const result = await getOffenderData(crn)
    callback(null, result)
  } catch (err) {
    callback(err)
  }
}

module.exports = { offenderSummaryData }
