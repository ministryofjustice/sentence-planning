const logger = require('../../log')
const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')
const { sentencePlanChildrenBreadcrumbs } = require('./breadcrumbHelpers')

const processNeeds = (rawNeeds, checkedNeeds) => {
  return rawNeeds
    .sort(({ riskOfHarm }) => (riskOfHarm ? -1 : 1))
    .map(({ name, riskOfHarm }) => {
      return {
        text: name,
        value: name,
        checked: checkedNeeds.find(({ name: nameCheck }) => name === nameCheck) || false,
        hint: { text: riskOfHarm ? ' Risk of serious harm' : '' },
      }
    })
}

const statusDisplay = status => {
  return status ? `${status.substring(0, 1)}${status.substring(1).toLowerCase()}`.replace('_', ' ') : 'In progress'
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

const processProgress = progress => {
  return progress
    .sort(({ created: createdAlt }, { created }) => created > createdAlt)
    .map(({ comments, created, createdBy, status }, index) => {
      return {
        status: statusDisplay(status),
        comments,
        dateCreated: getTimeStringFromISO8601(created),
        createdBy,
        open: index === 0,
      }
    })
}

module.exports = (sentencePlanningService, redirectPath, redirectCompletedPath) => async (req, res) => {
  try {
    const {
      params: { sentencePlanId, stepId, id: oasysOffenderId = '' },
    } = req
    const { locals } = res
    const { forename1, familyName } = locals
    const token = req.get('X-Auth-Token')
    const step = await sentencePlanningService.getSentencePlanStep(token, sentencePlanId, stepId)
    const needs = await sentencePlanningService.getSentencePlanNeeds(token, sentencePlanId)
    const { needs: stepNeeds, progress, status, intervention, description, created, updated, strength, owner } = step
    const newLocals = Object.assign(locals)
    newLocals.description = description
    newLocals.intervention = intervention
    newLocals.strength = strength
    newLocals.owner = owner
    newLocals.progress = processProgress(progress)
    newLocals.needs = processNeeds(needs, stepNeeds)
    newLocals.created = created
    newLocals.lastUpdate = updated
    newLocals.currentStatus = statusDisplay(status)
    newLocals.interventionOptions = getInterventionTypes(intervention || 'none')
    newLocals.breadcrumbs = sentencePlanChildrenBreadcrumbs(
      oasysOffenderId,
      forename1,
      familyName,
      sentencePlanId,
      created || updated
    )
    newLocals.completed = status === 'COMPLETED' || status === 'PARTLY_COMPLETED' || status === 'ABANDONED'
    return redirectCompletedPath && newLocals.completed
      ? res.render(redirectCompletedPath, newLocals)
      : res.render(redirectPath, newLocals)
  } catch (error) {
    logger.warn(`Could not render step ERROR: ${error}`)
    return res.redirect('/')
  }
}
