const logger = require('../../log')
const { searchBreadcrumb, summaryBreadcrumb } = require('./breadcrumbHelpers')
const { getSentencePlan, getSentencePlanSteps, getSentencePlanPastSteps } = require('./sentencePlanHelpers')

module.exports = () => async (req, res) => {
  const {
    params: { id: oasysOffenderId, sentencePlanId },
  } = req
  try {
    const { locals } = res
    const { forename1, familyName } = locals
    locals.sentencePlan = getSentencePlan(sentencePlanId, locals.formObject.sentencePlans)
    locals.steps = getSentencePlanSteps(locals.sentencePlan)
    locals.pastSteps = getSentencePlanPastSteps(locals.sentencePlan)
    locals.sentencePlanId = sentencePlanId
    locals.breadcrumbs = [searchBreadcrumb(), summaryBreadcrumb(oasysOffenderId, forename1, familyName)]
    locals.linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}/step/`
    return res.render('../views/pages/sentencePlan', locals)
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    return res.redirect('/')
  }
}
