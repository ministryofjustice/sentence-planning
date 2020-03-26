const { getMotivations } = require('../../../common/data/sentencePlanningApi')
const { logger } = require('../../../common/logging/logger')

const getMotivation = async (action, body, tokens) => {
  try {
    const { motivationUUID: actionMotivationUUID = '' } = action || {}
    const { motivation: bodyMotivationUUID = '' } = body || {}
    const motivations = await getMotivations(tokens)
    const currentMotivationUUID = bodyMotivationUUID || actionMotivationUUID || ''
    return {
      motivationList: motivations.map(({ motivationText: text, uuid: value }) => ({
        text,
        value,
        checked: value === currentMotivationUUID,
      })),
    }
  } catch (error) {
    logger.error(`Could not retrieve motivation list`)
    throw error
  }
}

module.exports = { getMotivation }
