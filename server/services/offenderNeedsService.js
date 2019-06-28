const { getOffenderNeeds } = require('../data/oasysClient')
const logger = require('../../log.js')

const offenderNeeds = async (idType, id, callback) => {
  logger.info(`Calling getOffenderData(${idType}, ${id})`)
  try {
    const result = await getOffenderNeeds(idType, id)
    callback(null, result)
  } catch (error) {
    callback(error)
  }
}

module.exports = { offenderNeeds }
