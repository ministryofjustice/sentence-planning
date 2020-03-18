const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjectiveAction, getInterventions } = require('../../common/data/sentencePlanningApi')
const { catchAndReThrowError } = require('../../common/utils/util')
const { getMotivation } = require('../../app/partials/motivations/get.controller')

const getActionData = async (req, res, next) => {
  const {
    body,
    params: { planId, objectiveId, actionId },
    tokens,
  } = req
  try {
    const action = await getSentencePlanObjectiveAction(planId, objectiveId, actionId, tokens).catch(error =>
      catchAndReThrowError(
        `Could not retrieve action ${actionId} for objective ${objectiveId}, sentence plan ${planId}`,
        error
      )
    )
    const [interventionList, { motivationList }] = await Promise.all([
      await getInterventions(tokens),
      await getMotivation(action, body, tokens),
    ])
    Object.assign(req, { action, interventionList, motivationList })
    return next()
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to update an action. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { getActionData }
