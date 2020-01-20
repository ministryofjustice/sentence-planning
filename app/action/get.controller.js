const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjectiveAction } = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels } = require('../../common/utils/util')
const { getActionDescriptionIntervention } = require('./interventionList/get.controller')
const { getTargetDate } = require('./targetDate/get.controller')

const getAction = async (
  { path, errors, errorSummary, body, params: { planId, objectiveId, actionId }, session: { 'x-auth-token': token } },
  res
) => {
  let action = {}
  try {
    if (actionId.toLowerCase() !== 'new') {
      action = await getSentencePlanObjectiveAction(planId, objectiveId, actionId, token)
    }
    const nexturl = path.substring(0, path.lastIndexOf('/'))
    const backurl = removeUrlLevels(path, 2)
    const actionDescriptionIntervention = await getActionDescriptionIntervention(action, body, token)
    return res.render(`${__dirname}/index`, {
      ...body,
      errors,
      errorSummary,
      ...actionDescriptionIntervention,
      ...getTargetDate(action, body),
      nexturl,
      backurl,
    })
  } catch (error) {
    logger.error(
      `Could not retrieve action ${actionId} for objective ${objectiveId} sentence plan ${planId}, error: ${error}`
    )
    return res.render('app/error', { error })
  }
}

module.exports = { getAction }
