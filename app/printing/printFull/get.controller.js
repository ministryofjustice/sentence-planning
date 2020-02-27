const { logger } = require('../../../common/logging/logger')
const { getCommentText } = require('../../../common/utils/getCommentText')
const {
  removeUrlLevels,
  groupBy,
  getObjectiveType,
  formatObjectiveActionsForPrintDisplay,
} = require('../../../common/utils/util')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')
const {
  COMMENT_TYPES: { YOUR_RESPONSIVITY, YOUR_SUMMARY, THEIR_RESPONSIVITY, THEIR_SUMMARY },
} = require('../../../common/utils/constants')

const printFullSentencePlan = async ({ path, params: { id, planId }, tokens }, res) => {
  try {
    const backUrl = removeUrlLevels(path, 1)

    let objectives
    let comments

    // get the sentence plan
    try {
      ;({ comments, objectives = [] } = await getSentencePlan(planId, tokens))
    } catch (error) {
      logger.error(`Could not retrieve active sentence plan ${planId} for offender ${id}, error: ${error}`)
      return res.render('app/error', { error })
    }

    objectives.forEach(objective => {
      const currentObjective = objective

      currentObjective.type = getObjectiveType(currentObjective)
      currentObjective.actionsDisplay = formatObjectiveActionsForPrintDisplay(currentObjective.actions)
    })

    objectives = groupBy(objectives, ({ type }) => type)

    return res.render(`${__dirname}/index`, {
      backUrl,
      diversity: getCommentText(comments, YOUR_RESPONSIVITY),
      decisions: getCommentText(comments, YOUR_SUMMARY),
      needToKnow: getCommentText(comments, THEIR_RESPONSIVITY),
      comments: getCommentText(comments, THEIR_SUMMARY),
      objectives,
    })
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to print the sentence plan. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { printFullSentencePlan }
