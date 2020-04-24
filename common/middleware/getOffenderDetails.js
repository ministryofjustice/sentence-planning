const logger = require('../logging/logger')
const { getOffenderData } = require('../data/sentencePlanningApi')
const { RISK } = require('../utils/constants')

const capitalizeName = name => `${name.charAt().toUpperCase()}${name.slice(1).toLowerCase()}`

module.exports = async ({ tokens, params: { id } }, res, next) => {
  try {
    const { familyName, forename1, crn = null, nomisId: noms = null, riskToOthers = '' } = await getOffenderData(
      id,
      tokens
    )
    if (!familyName || !forename1) throw new Error('Required offender details could not be found')
    res.locals.offenderDetails = {
      fullName: `${capitalizeName(forename1)} ${capitalizeName(familyName)}`,
      crn,
      noms,
      riskLevel: RISK[riskToOthers] || '',
    }
    return next()
  } catch (error) {
    logger.error(`Could not retrieve offender details for ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}
