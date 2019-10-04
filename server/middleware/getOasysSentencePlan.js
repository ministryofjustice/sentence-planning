const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')
const { searchBreadcrumb, summaryBreadcrumb } = require('./breadcrumbHelpers')
const logger = require('../../log')

module.exports = sentencePlanningService => async (req, res) => {
  const {
    params: { id: oasysOffenderId, oasysSentencePlanId },
  } = req
  try {
    const { locals } = res

    locals.oasysSentencePlan = await sentencePlanningService.getLegacySentencePlan(
      req.get('X-Auth-Token'),
      oasysOffenderId,
      oasysSentencePlanId
    )

    const { forename1, familyName, oasysSentencePlan } = locals

    locals.breadcrumbs = [searchBreadcrumb(), summaryBreadcrumb(oasysOffenderId, forename1, familyName)]
    locals.oasysSentencePlan.createdDate = getTimeStringFromISO8601(oasysSentencePlan.createdDate)
    return res.render('../views/pages/oaSysSentencePlan', locals)
  } catch (err) {
    logger.warn(`Could not find legacy sentence plan for offender ${oasysOffenderId} id ${oasysSentencePlanId}`)
    return res.redirect('/')
  }
}
