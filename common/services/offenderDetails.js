const { logger } = require('../logging/logger')

const capitalizeName = name => `${name.charAt().toUpperCase()}${name.slice(1).toLowerCase()}`

module.exports = function createOffenderDetailsService({ getOffenderData }) {
  const getOffenderDetails = async oasysOffenderId => {
    try {
      const {
        familyName,
        forename1,
        crn,
        nomisId,
      } = await getOffenderData(oasysOffenderId)
      if (!familyName || !forename1) throw new Error('Required offender details could not be found')
      return {
        fullName: `${capitalizeName(forename1)} ${capitalizeName(familyName)}`,
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
