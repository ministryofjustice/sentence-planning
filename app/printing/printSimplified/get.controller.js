const { logger } = require('../../../common/logging/logger')
const {
  removeUrlLevels,
  groupBy,
  getObjectiveType,
  formatObjectiveActionsForPrintDisplay,
} = require('../../../common/utils/util')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')

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

    objectives.forEach(objective => {
      const currentObjective = objective
      currentObjective.type = getObjectiveType(currentObjective)
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
