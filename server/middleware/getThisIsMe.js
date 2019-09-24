const logger = require('../../log')
const { sentencePlanChildrenBreadcrumbs } = require('./breadcrumbHelpers')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

module.exports = () => async (req, res) => {
  const {
    params: { id: oasysOffenderId, sentencePlanId },
  } = req
  try {
    const { locals } = res
    const { forename1, familyName, sentencePlan = {} } = locals

    locals.breadcrumbs = sentencePlanChildrenBreadcrumbs(
      oasysOffenderId,
      forename1,
      familyName,
      sentencePlanId,
      sentencePlan ? getTimeStringFromISO8601(sentencePlan.dateCreated) : null
    )
    locals.sentencePlanId = sentencePlanId
    return res.render('../views/formPages/thisIsMe', locals)
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    return res.redirect('/')
  }
}
