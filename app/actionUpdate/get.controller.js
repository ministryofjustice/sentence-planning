const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjectiveAction, getInterventions } = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels, catchAndReThrowError } = require('../../common/utils/util')
const { getTargetDate } = require('../partials/targetDate/get.controller')
const { getMotivation } = require('../partials/motivations/get.controller')
const { getResponsibility } = require('../partials/responsibility/get.controller')
const { getStatus } = require('../partials/status/get.controller')

const getInterventionText = async (token, intervention) => {
  const interventionList = await getInterventions(token).catch(error =>
    catchAndReThrowError('Could not retrieve the action intervention/description.', error)
  )
  return interventionList.find(({ uuid }) => uuid === intervention).shortDescription
}

const getActionUpdate = async (
  { path, errors, errorSummary, body, params: { planId, objectiveId, actionId }, tokens },
  res
) => {
  try {
    const action = await getSentencePlanObjectiveAction(planId, objectiveId, actionId, tokens).catch(error =>
      catchAndReThrowError(
        `Could not retrieve action ${actionId} for objective ${objectiveId}, sentence plan ${planId}`,
        error
      )
    )
    const backUrl = `${removeUrlLevels(path, 2)}`
    const { intervention, description } = action
    const actionText = intervention ? await getInterventionText(tokens, intervention) : description
    const { motivationList } = await getMotivation(action, body, tokens).catch(error =>
      catchAndReThrowError(`Could not retrieve motivation list`, error)
    )
    return res.render(`${__dirname}/index`, {
      ...body,
      errors,
      errorSummary,
      actionText,
      ...getTargetDate(action, body),
      motivationList,
      ...getResponsibility(action, body),
      ...getStatus(action, body),
      backUrl,
    })
  } catch (error) {
    const newError = new Error(`An error occurred whilst trying to update an action. ${error}`)
    logger.error(newError)
    return res.render('app/error', { error: newError })
  }
}

module.exports = { getActionUpdate, getInterventionText }
