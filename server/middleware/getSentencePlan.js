const logger = require('../../log')
const { searchBreadcrumb, summaryBreadcrumb } = require('./breadcrumbHelpers')
const { getSentencePlanSteps } = require('./sentencePlanHelpers')

module.exports = sentencePlanningService => async (req, res) => {
  const {
    params: { id: oasysOffenderId, sentencePlanId },
  } = req
  try {
    const { locals } = res
    const sentencePlan = await sentencePlanningService.getSentencePlan(req.get('X-Auth-Token'), sentencePlanId)
    locals.sentencePlan = sentencePlan
    const { forename1, familyName } = locals
    locals.pastSteps = getSentencePlanSteps(sentencePlan.steps.filter(isCompleted))
    locals.steps = getSentencePlanSteps(sentencePlan.steps.filter(value => !isCompleted(value)))
    locals.sentencePlanId = sentencePlanId
    locals.breadcrumbs = [searchBreadcrumb(), summaryBreadcrumb(oasysOffenderId, forename1, familyName)]
    locals.linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}/step/`
    return res.render('../views/pages/sentencePlan', locals)
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    return res.redirect('/')
  }
}

const isCompleted = ({ status }) => {
  return status === 'COMPLETED' || status === 'PARTLY_COMPLETED' || status === 'ABANDONED'
}
