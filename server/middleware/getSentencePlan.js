const logger = require('../../log')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')
const { searchBreadcrumb, summaryBreadcrumb } = require('./breadcrumbHelpers')

const getProgress = (progress, defaultProgress = 'In progress') => {
  if (!progress || progress.length === 0) return defaultProgress
  const currentProgress = progress.reduce((next, last) => (next.dateCreated > last.dateCreated ? next : last))
    .progressStep
  return `${currentProgress.substring(0, 1)}${currentProgress.substring(1).toLowerCase()}`.replace('_', ' ')
}

const getSentencePlanSteps = (oasysOffenderId, sentencePlanId, sentencePlans) => {
  return sentencePlans
    .find(({ sentencePlanId: id }) => {
      return id === sentencePlanId
    })
    .steps.map(({ step = '', intervention = '', stepId, dateCreated, progress = [] }) => {
      return {
        step: step || intervention,
        status: getProgress(progress),
        lastUpdate: getTimeStringFromISO8601(dateCreated),
        stepId,
      }
    })
}

const getSentencePlanPastSteps = (oasysOffenderId, sentencePlanId, sentencePlans) => {
  try {
    return sentencePlans
      .find(({ sentencePlanId: id }) => {
        return id === sentencePlanId
      })
      .pastSteps.map(({ step = '', intervention = '', stepId, dateCreated, progress = [] }) => {
        return {
          step: step || intervention,
          status: getProgress(progress, 'completed'),
          lastUpdate: getTimeStringFromISO8601(dateCreated),
          stepId,
        }
      })
  } catch (error) {
    return []
  }
}

module.exports = () => async (req, res) => {
  const {
    params: { id: oasysOffenderId, sentencePlanId },
  } = req
  try {
    const { locals } = res
    const { forename1, familyName } = locals
    locals.steps = getSentencePlanSteps(oasysOffenderId, sentencePlanId, locals.formObject.sentencePlans)
    locals.pastSteps = getSentencePlanPastSteps(oasysOffenderId, sentencePlanId, locals.formObject.sentencePlans)
    locals.sentencePlanId = sentencePlanId
    locals.breadcrumbs = [searchBreadcrumb(), summaryBreadcrumb(oasysOffenderId, forename1, familyName)]
    locals.linkRoot = `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}/step/`
    return res.render('../views/pages/sentencePlan', locals)
  } catch (err) {
    logger.warn(`Could not find sentence plan: ${sentencePlanId}`)
    return res.redirect('/')
  }
}
