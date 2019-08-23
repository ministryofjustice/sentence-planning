const logger = require('../../log')
const { getSentencePlan, addFriendlyStepProgress, getSentencePlanSteps } = require('./sentencePlanHelpers')
const { sentencePlanChildrenBreadcrumbs } = require('../middleware/breadcrumbHelpers')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

module.exports = () => async (req, res) => {
  const {
    params: { id: oasysOffenderId, sentencePlanId },
  } = req
  try {
    const { locals } = res
    locals.sentencePlan = getSentencePlan(sentencePlanId, locals.formObject.sentencePlans)
    const { forename1, familyName, sentencePlan } = locals

    locals.steps = addFriendlyStepProgress(getSentencePlanSteps(sentencePlan.steps))
    locals.pastSteps = addFriendlyStepProgress(getSentencePlanSteps(sentencePlan.pastSteps))
    locals.sentencePlanId = sentencePlanId
    locals.breadcrumbs = sentencePlanChildrenBreadcrumbs(
      oasysOffenderId,
      forename1,
      familyName,
      sentencePlanId,
      getTimeStringFromISO8601(locals.sentencePlan.dateCreated)
    )
    locals.linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}/step/`
    return res.render('../views/pages/sentencePlanSummary', locals)
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    return res.redirect('/')
  }
}
