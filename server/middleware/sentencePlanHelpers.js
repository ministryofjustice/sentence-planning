const { getTimeStringFromISO8601 } = require('../utils/displayHelpers')

const getPrintableProgress = status => `${status.substring(0, 1)}${status.substring(1).toLowerCase()}`.replace('_', ' ')

const getProgress = (progress, defaultProgress = 'In progress') => {
  if (!progress || progress.length === 0) return { printableProgress: defaultProgress }
  const currentProgress = progress.reduce((next, last) => (next.dateCreated > last.dateCreated ? next : last))
  return Object.assign({ printableProgress: getPrintableProgress(currentProgress.progressStep) }, currentProgress)
}
const getSentencePlanSteps = sentencePlanSteps => {
  try {
    return sentencePlanSteps.map(({ description: step = '', intervention = '', id: stepId, updated, status }) => {
      return {
        step: step || intervention,
        status: getPrintableProgress(status),
        lastUpdate: getTimeStringFromISO8601(updated),
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
  getSentencePlanSteps,
  addFriendlyStepProgress,
}
