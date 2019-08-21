const logger = require('../../log')
const { sentencePlanChildrenBreadcrumbs } = require('./breadcrumbHelpers')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

module.exports = () => async (req, res) => {
  const {
    params: { id: oasysOffenderId, sentencePlanId },
  } = req
  try {
    const { locals } = res
    const {
      forename1,
      familyName,
      formObject: { sentencePlans },
    } = locals
    locals.sentencePlanId = sentencePlanId
    locals.linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}/step/`
    const sentencePlan = sentencePlans.find(({ sentencePlanId: spId }) => sentencePlanId === spId)
    locals.sentencePlan = sentencePlan
    locals.breadcrumbs = sentencePlanChildrenBreadcrumbs(
      oasysOffenderId,
      forename1,
      familyName,
      sentencePlanId,
      sentencePlan ? getTimeStringFromISO8601(sentencePlan.dateCreated) : null
    )
    return res.render('../views/formPages/motivations', locals)
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    return res.redirect('/')
  }
}
