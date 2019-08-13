const logger = require('../../log')
const { addFriendlyStepProgress, getSentencePlanSteps, getSentencePlanPastSteps } = require('./sentencePlanHelpers')
const { sentencePlanChildrenBreadcrumbs } = require('../middleware/breadcrumbHelpers')

module.exports = () => async (req, res) => {
  const {
    params: { id: oasysOffenderId, sentencePlanId },
  } = req
  try {
    const { locals } = res
    const { forename1, familyName } = locals
    locals.steps = addFriendlyStepProgress(
      getSentencePlanSteps(oasysOffenderId, sentencePlanId, locals.formObject.sentencePlans)
    )
    locals.pastSteps = addFriendlyStepProgress(
      getSentencePlanPastSteps(oasysOffenderId, sentencePlanId, locals.formObject.sentencePlans)
    )
    locals.sentencePlanId = sentencePlanId
    locals.breadcrumbs = sentencePlanChildrenBreadcrumbs(
      oasysOffenderId,
      forename1,
      familyName,
      sentencePlanId,
      locals.steps[0].dateCreated
    )
    locals.linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}/step/`
    return res.render('../views/pages/sentencePlanSummary', locals)
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    return res.redirect('/')
  }
}
