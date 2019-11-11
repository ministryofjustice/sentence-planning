const logger = require('../logging/logger')
const offenderDetailsServices = require('../services/offenderDetails')
const offenderAssessmentData = require('../data/offenderAssessment')

module.exports = async ({ params: { id } }, res, next) => {
  try {
    const offenderDetailsService = offenderDetailsServices(offenderAssessmentData)
    res.locals.offenderDetails = await offenderDetailsService.getOffenderDetails(id)
    logger.debug(JSON.stringify(res.locals.offenderDetails))
    return next()
  } catch (error) {
    logger.error(`Could not retrieve offender details for ${id}, error: ${error}`)
    return res.render('app/error', { error })
  }
}
