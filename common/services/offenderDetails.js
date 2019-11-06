const { logger } = require('../logging/logger')

module.exports = function createOffenderDetailsService({ getOffenderData }) {
  const getOffenderDetails = async oasysOffenderId => {
    try {
      const {
        familyName,
        forename1,
        identifiers: { crn = null, noms = null },
      } = await getOffenderData(oasysOffenderId)
      if (!familyName || !forename1) throw new Error('Required offender details could not be found')
      return {
        fullName: `${forename1} ${familyName}`,
        crn,
        noms,
      }
    } catch (error) {
      logger.error(error, 'Error during getOffenderDetails')
      throw error
    }
  }

  return {
    getOffenderDetails,
  }
}
