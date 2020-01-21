const { getMotivations } = require('../../../common/data/sentencePlanningApi')
const { logger } = require('../../../common/logging/logger')

const getMotivation = async (
  { motivationUUID: actionMotivationUUID = '' },
  { motivation: bodyMotivationUUID = '' },
  token
) => {
  try {
    const motivations = await getMotivations(token)
    const currentMotivationUUID = bodyMotivationUUID || actionMotivationUUID || ''
    return {
      motivationList: motivations.map(({ friendlyText: text, uuid: value }) => ({
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
