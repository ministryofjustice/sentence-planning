const { logger } = require('../../../common/logging/logger')
const {
  removeUrlLevels,
  groupBy,
  getObjectiveType,
  formatObjectiveActionsForPrintDisplay,
  getActionText,
} = require('../../../common/utils/util')
const { getInterventions, getSentencePlan } = require('../../../common/data/sentencePlanningApi')

const printSimplifiedSentencePlan = async ({ path, params: { id, planId }, tokens }, res) => {
  try {
    const backUrl = removeUrlLevels(path, 1)

    let objectives

    // get the sentence plan
    try {
      ;({ objectives = [] } = await getSentencePlan(planId, tokens))
    } catch (error) {
      logger.error(`Could not retrieve active sentence plan ${planId} for offender ${id}, error: ${error}`)
      return res.render('app/error', { error })
    }

    // only get intervention data if there is any objective with an action with an intervention
    const hasInterventions = objectives.some(objective => {
      return objective.actions.some(({ intervention }) => intervention)
    })

    const interventionList = hasInterventions ? await getInterventions(tokens) : []

    objectives.forEach(objective => {
      const currentObjective = objective
      currentObjective.type = getObjectiveType(currentObjective)
      objective.actions.forEach(action => {
        const tempAction = action
        tempAction.actionText = getActionText(action, interventionList)
      })
      currentObjective.actionsDisplay = formatObjectiveActionsForPrintDisplay(currentObjective.actions, true)
    })

    objectives = groupBy(objectives, ({ type }) => type)

    return res.render(`${__dirname}/index`, {
      backUrl,
      objectives,
    })
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to print the sentence plan. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { printSimplifiedSentencePlan }
