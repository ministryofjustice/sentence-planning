const { logger } = require('../../../common/logging/logger')
const { removeUrlLevels, groupBy, getYearMonthFromDate, getStatusText } = require('../../../common/utils/util')
const { getCommentText } = require('../../../common/utils/getCommentText')
const { getSentencePlan } = require('../../../common/data/sentencePlanningApi')
const { COMMENT_TYPES, ACTION_STATUS_TYPES } = require('../../../common/utils/constants')

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

    // determine the status of each objective
    objectives = objectives.map(objective => {
      const currentObjective = objective

      // objectives default to active if not caught with the rules below
      currentObjective.type = 'active'

      if (currentObjective.actions.every(({ status }) => [ACTION_STATUS_TYPES.NOT_STARTED].includes(status))) {
        currentObjective.type = 'future'
      } else if (
        currentObjective.actions.every(({ status }) =>
          [
            ACTION_STATUS_TYPES.COMPLETED,
            ACTION_STATUS_TYPES.PARTIALLY_COMPLETED,
            ACTION_STATUS_TYPES.ABANDONED,
          ].includes(status)
        )
      ) {
        currentObjective.type = 'closed'
      }

      const actionsDisplayList = currentObjective.actions.map(action => {
        const { monthName, year } = getYearMonthFromDate(action.targetDate)

        const retVal = [
          { text: action.description },
          { text: `${monthName} ${year}`, format: 'numeric' },
          { text: getStatusText(action.status), format: 'numeric' },
        ]

        return retVal
      })

      currentObjective.actionsDisplay = actionsDisplayList
      return currentObjective
    })

    objectives = groupBy(objectives, ({ type }) => type)

    return res.render(`${__dirname}/index`, {
      backUrl,
      diversity: getCommentText(comments, COMMENT_TYPES.YOUR_RESPONSIVITY),
      decisions: getCommentText(comments, COMMENT_TYPES.YOUR_SUMMARY),
      needToKnow: getCommentText(comments, COMMENT_TYPES.THEIR_RESPONSIVITY),
      comments: getCommentText(comments, COMMENT_TYPES.THEIR_SUMMARY),
      objectives,
    })
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to print the sentence plan. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { printFullSentencePlan }
