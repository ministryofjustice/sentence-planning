const { getOffenderData } = require('../data/oasysClient')
const logger = require('../../log.js')

const offenderSummaryData = async (idType, id, callback) => {
  logger.info(`Calling getOffenderData(${idType}, ${id})`)
  try {
    const result = await getOffenderData(idType, id)

    callback(null, result)
  } catch (error) {
    callback(error)
  }
}

module.exports = { offenderSummaryData }
