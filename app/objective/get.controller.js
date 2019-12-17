const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjective } = require('../../common/data/sentencePlanningApi')
const { removeUrlLevels } = require('../../common/utils/util')

const getObjective = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId, objectiveId }, session: { 'x-auth-token': token } },
  res
) => {
  const nexturl = path.substring(0, path.lastIndexOf('/'))
  const backurl = removeUrlLevels(path, 2)
  const renderDetails = { ...renderInfo, nexturl, backurl }

  try {
    if (body.objective !== undefined) {
      renderDetails.objective = body.objective
    } else if (objectiveId.toLowerCase() !== 'new') {
      renderDetails.objective = await getSentencePlanObjective(planId, objectiveId, token)
    }
    return res.render(`${__dirname}/index`, { ...body, errors, errorSummary, ...renderDetails })
  } catch (error) {
    logger.error(`Could not retrieve objective ${objectiveId} for sentence plan ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getObjective }
