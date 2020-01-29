const { logger } = require('../../common/logging/logger')
const { getSentencePlanComments } = require('../../common/data/sentencePlanningApi')
const { getCommentText } = require('../../common/utils/getCommentText')

const getDecisions = async (
  { path, errors, errorSummary, body, renderInfo, params: { planId }, headers: { 'x-auth-token': token } },
  res
) => {
  const renderDetails = renderInfo || {}
  renderDetails.backurl = path.substring(0, path.lastIndexOf('/'))

  try {
    if (body.decisions !== undefined) {
      renderDetails.decisions = body.decisions
    } else {
      const comments = await getSentencePlanComments(planId, token)
      renderDetails.decisions = getCommentText(comments, 'YOUR_SUMMARY')
    }
    return res.render(`${__dirname}/index`, { ...body, errors, errorSummary, ...renderDetails })
  } catch (error) {
    logger.error(`Could not retrieve sentence plan comments for ${planId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { getDecisions }
