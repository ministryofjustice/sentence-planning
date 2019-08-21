const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

const getProgress = (progress, defaultProgress = 'In progress') => {
  if (!progress || progress.length === 0) return defaultProgress
  const currentProgress = progress.reduce((next, last) => (next.dateCreated > last.dateCreated ? next : last))
    .progressStep
  return `${currentProgress.substring(0, 1)}${currentProgress.substring(1).toLowerCase()}`.replace('_', ' ')
}
const getSentencePlan = (sentencePlanId, sentencePlans) => {
  return sentencePlans.find(({ sentencePlanId: id }) => {
    return id === sentencePlanId
  })
}

const getSentencePlanSteps = sentencePlan => {
  try {
    return sentencePlan.steps.map(({ step = '', intervention = '', stepId, dateCreated, progress = [] }) => {
      return {
        step: step || intervention,
        status: getProgress(progress),
        lastUpdate: getTimeStringFromISO8601(dateCreated),
        stepId,
      }
    })
  } catch (error) {
    return []
  }
}

const getSentencePlanPastSteps = sentencePlan => {
  try {
    return sentencePlan.pastSteps.map(({ step = '', intervention = '', stepId, dateCreated, progress = [] }) => {
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
const addFriendlyStepProgress = steps => {
  return steps.map(step => {
    const friendlyStatusTexts = {
      'In progress': "I'm doing it",
      Paused: 'On hold with this',
      Completed: "I've done it!",
      'Partly completed': "I've mostly done it",
      Abandoned: 'Had to stop',
    }
    return { ...step, friendlyStatus: friendlyStatusTexts[step.status] || '' }
  })
}

module.exports = {
  getProgress,
  getSentencePlan,
  getSentencePlanSteps,
  getSentencePlanPastSteps,
  addFriendlyStepProgress,
}
