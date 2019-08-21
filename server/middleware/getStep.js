const logger = require('../../log')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')
const { sentencePlanChildrenBreadcrumbs } = require('./breadcrumbHelpers')

const processNeeds = (rawNeeds, checkedNeeds = []) => {
  return rawNeeds
    .sort(({ riskOfHarm }) => (riskOfHarm ? -1 : 1))
    .map(({ name, riskOfHarm }) => {
      return {
        text: name,
        value: name,
        checked: checkedNeeds.includes(name),
        hint: { text: riskOfHarm ? ' Risk of serious harm' : '' },
      }
    })
}

const getInterventionTypes = currentIntervention => {
  return [
    'none',
    'A – Z',
    'Motivation & Engagement (M&E) Standalone',
    'Thinking Skills Programme (TSP)',
    'Kaizen',
    'Becoming New Me Plus (BNM+)',
    'New Me Strengths (NMS)',
    'Alcohol Related Violence (ARV)',
    'Building Skills for Recovery (BSR)',
    'Drink Impaired Drivers Programme (DIDP)',
    'Building Better Relationships (BBR)',
    'Resolve',
    'Choices, Actions, Relationships, Emotions (CARE)',
    'Horizon',
    'iHorizon',
    'Healthy Sex Programme (HSP)',
    'Healthy Identity Intervention (HII)',
    'Developing Dialogues (DD)',
    'Identity Matters (IM)',
    'New Me MOT',
    'Living as New Me (LNM)',
  ].map(val => {
    return { value: val, text: val, selected: val === currentIntervention }
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
  if (stepId === 'new')
    return { sentencePlanId, stepId, sentencePlanDateCreated, formObject: {}, needs: processNeeds(rawNeeds, []) }
  let formObject = sentencePlan.steps.find(({ stepId: id }) => {
    return id === stepId
  })
  if (!formObject) {
    formObject = sentencePlan.pastSteps.find(({ stepId: id }) => {
      return id === stepId
    })
    if (!formObject) throw new Error(`Cannot find step ${stepId} in sentence plan ${sentencePlanId}.`)
    formObject.completed = true
  }

  if (formObject.progress) {
    formObject.progress = formObject.progress
      .sort(({ dateCreated: dateCreatedAlt }, { dateCreated }) => dateCreated > dateCreatedAlt)
      .map(({ progressStep, dateCreated, comments }, index) => {
        const progressStepString = `${progressStep.substring(0, 1)}${progressStep.substring(1).toLowerCase()}`.replace(
          '_',
          ' '
        )
        return {
          progressStep: progressStepString,
          comments,
          dateCreated: getTimeStringFromISO8601(dateCreated),
          open: index === 0,
        }
      })
  }
  const checkedNeeds = formObject.needs ? formObject.needs : []
  return { sentencePlanId, stepId, sentencePlanDateCreated, formObject, needs: processNeeds(rawNeeds, checkedNeeds) }
}

module.exports = (redirectPath, redirectCompletedPath) => async (req, res) => {
  try {
    const {
      params: { sentencePlanId, stepId, id: oasysOffenderId = '' },
    } = req
    const { locals } = res
    const {
      forename1,
      familyName,
      needs,
      formObject: { sentencePlans },
    } = locals
    const newLocals = Object.assign(locals, processFormData(sentencePlanId, stepId, sentencePlans, needs))
    newLocals.lastUpdate = newLocals.sentencePlanDateCreated
    newLocals.currentStatus = newLocals.formObject.progress
      ? newLocals.formObject.progress[0].progressStep
      : 'In progress'
    newLocals.interventionOptions = getInterventionTypes(newLocals.formObject.intervention || 'none')
    newLocals.breadcrumbs = sentencePlanChildrenBreadcrumbs(
      oasysOffenderId,
      forename1,
      familyName,
      sentencePlanId,
      locals.sentencePlanDateCreated
    )
    return redirectCompletedPath && newLocals.formObject.completed
      ? res.render(redirectCompletedPath, newLocals)
      : res.render(redirectPath, newLocals)
  } catch (error) {
    logger.warn(`Could not render step ERROR: ${error}`)
    return res.redirect('/')
  }
}
