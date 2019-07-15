const logger = require('../../log')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

const generateSentencePlanBreadcrumb = (oasysOffenderId, sentencePlanId, sentencePlanDateCreated, breadcrumbs = []) => {
  return [
    ...breadcrumbs,
    {
      text: `Sentence plan ${sentencePlanDateCreated}`,
      href: `/sentence-plan/oasys-offender-id/${oasysOffenderId}/sentence-plan/${sentencePlanId}`,
    },
  ]
}

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

module.exports = () => async (req, res) => {
  try {
    const {
      params: { sentencePlanId, stepId, id: oasysOffenderId = '' },
    } = req
    const { locals } = res
    const { breadcrumbs = [], needs } = locals
    const {
      formObject: { sentencePlans },
    } = locals
    const newLocals = Object.assign(locals, processFormData(sentencePlanId, stepId, sentencePlans, needs))
    if (sentencePlanId !== 'new')
      newLocals.breadcrumbs = generateSentencePlanBreadcrumb(
        oasysOffenderId,
        sentencePlanId,
        newLocals.sentencePlanDateCreated,
        breadcrumbs
      )
    return res.render('../views/formPages/step', newLocals)
  } catch (error) {
    logger.warn(`Could not render step ERROR: ${error}`)
    return res.redirect('/')
  }
}
