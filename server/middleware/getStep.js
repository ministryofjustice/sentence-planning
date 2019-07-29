const logger = require('../../log')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')
const { searchBreadcrumb, summaryBreadcrumb, sentencePlanBreadcrumb } = require('./breadcrumbHelpers')

const processNeeds = (rawNeeds, checkedNeeds = []) => {
  return rawNeeds
    .sort(({ riskOfHarm }) => {
      return riskOfHarm ? 1 : -1
    })
    .map(({ name, riskOfHarm }) => {
      return {
        text: name,
        value: name,
        checked: checkedNeeds.includes(name),
        hint: { text: riskOfHarm ? '' : ' Risk of serious harm' },
      }
    })
}

const processFormData = (sentencePlanId, stepId, sentencePlans, rawNeeds) => {
  if (sentencePlanId === 'new') {
    return { sentencePlanId, stepId, formObject: {}, needs: processNeeds(rawNeeds) }
  }
  const sentencePlan = sentencePlans.find(({ sentencePlanId: id }) => {
    return id === sentencePlanId
  })
  const sentencePlanDateCreated = getTimeStringFromISO8601(sentencePlan.dateCreated)
  const formObject = sentencePlan.steps.find(({ stepId: id }) => {
    return id === stepId
  })
  if (!formObject && stepId !== 'new') throw new Error(`Cannot find step ${stepId} in sentence plan ${sentencePlanId}.`)
  const checkedNeeds = formObject && formObject.needs ? formObject.needs : []
  return { sentencePlanId, stepId, sentencePlanDateCreated, formObject, needs: processNeeds(rawNeeds, checkedNeeds) }
}

module.exports = redirectPath => async (req, res) => {
  try {
    const {
      params: { sentencePlanId, stepId, id: oasysOffenderId = '' },
    } = req
    const { locals } = res
    const { forename1, familyName, needs } = locals
    const {
      formObject: { sentencePlans },
    } = locals
    const newLocals = Object.assign(locals, processFormData(sentencePlanId, stepId, sentencePlans, needs))
    newLocals.breadcrumbs = [searchBreadcrumb(), summaryBreadcrumb(oasysOffenderId, forename1, familyName)]
    if (sentencePlanId !== 'new') {
      newLocals.breadcrumbs.push(
        sentencePlanBreadcrumb(oasysOffenderId, sentencePlanId, newLocals.sentencePlanDateCreated)
      )
    }
    return res.render(redirectPath, newLocals)
  } catch (error) {
    logger.warn(`Could not render step ERROR: ${error}`)
    return res.redirect('/')
  }
}
