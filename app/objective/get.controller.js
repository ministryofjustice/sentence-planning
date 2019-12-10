const { logger } = require('../../common/logging/logger')
const { getSentencePlanObjective } = require('../../common/data/sentencePlanningApi')

const getObjective = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId, objectiveId }, session: { 'x-auth-token': token } },
  res
) => {
  const nexturl = path.substring(0, path.lastIndexOf('/'))
  const renderDetails = { ...renderInfo, nexturl, backurl: `${nexturl}/decisions` }

  if (body.objective) {
    renderDetails.objective = body.objective
  }
  try {
    if (objectiveId) {
      renderDetails.objective = await getSentencePlanObjective(planId, objectiveId, token)
    }
    return res.render(`${__dirname}/index`, { ...renderDetails, ...body, errors, errorSummary })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan ${planId} objective for ${objectiveId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getObjective }
