const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjectiveAction } = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels } = require('../../common/utils/util')
const { getActionDescriptionIntervention } = require('../partials/interventionList/get.controller')
const { getTargetDate } = require('../partials/targetDate/get.controller')
const { getMotivation } = require('../partials/motivations/get.controller')
const { getResponsibility } = require('../partials/responsibility/get.controller')
const { getStatus } = require('../partials/status/get.controller')

const getAction = async (
  { tokens, path, errors, errorSummary, body, params: { planId, objectiveId, actionId } },
  res
) => {
  let action = {}
  try {
    if (actionId.toLowerCase() !== 'new') {
      action = await getSentencePlanObjectiveAction(planId, objectiveId, actionId, tokens)
    }
    const nexturl = path.substring(0, path.lastIndexOf('/'))
    const backurl = `${removeUrlLevels(path, 2)}/review`
    const actionDescriptionIntervention = await getActionDescriptionIntervention(action, body, tokens)
    const { motivationList } = await getMotivation(action, body, tokens)
    return res.render(`${__dirname}/index`, {
      ...body,
      errors,
      errorSummary,
      ...actionDescriptionIntervention,
      ...getTargetDate(action, body),
      motivationList,
      ...getResponsibility(action, body),
      ...getStatus(action, body),
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
