const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjectiveAction } = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels } = require('../../common/utils/util')

const getAction = async (
  {
    path,
    errors,
    errorSummary,
    body,
    renderInfo,
    params: { planId, objectiveId, actionId },
    session: { 'x-auth-token': token },
  },
  res
) => {
  let action
  try {
    if (body.action !== undefined) {
      action = body.action
    } else if (actionId.toLowerCase() !== 'new') {
      action = await getSentencePlanObjectiveAction(planId, objectiveId, actionId, token)
    }
    const nexturl = path.substring(0, path.lastIndexOf('/'))
    const backurl = removeUrlLevels(path, 2)
    return res.render(`${__dirname}/index`, { ...body, errors, errorSummary, ...renderInfo, nexturl, backurl, action })
  } catch (error) {
    logger.error(
      `Could not retrieve action ${actionId} for objective ${objectiveId} sentence plan ${planId}, error: ${error}`
    )
    return res.render('app/error', { error })
  }
}

module.exports = { getAction }
